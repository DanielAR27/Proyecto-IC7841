import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor de respuestas.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Detectar si es un error 401 (No autorizado) y si NO es un reintento
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Si el error viene del login o del refresh mismo, no intentamos renovar (evita bucles)
      if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/refresh')) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true; // Marcamos para no reintentar infinitamente

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
          throw new Error('No hay refresh token');
        }

        // Llamada directa con axios puro para evitar dependencias circulares
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
          refresh_token: refreshToken
        });

        // 1. Guardamos los nuevos tokens
        localStorage.setItem('token', data.token);
        localStorage.setItem('refresh_token', data.refresh_token);

        // 2. Actualizamos el header de la instancia y del request original
        api.defaults.headers['Authorization'] = `Bearer ${data.token}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;

        // 3. Reintentamos la petición original con el nuevo token
        return api(originalRequest);

      } catch (refreshError) {
        // Si falla la renovación, ahí sí cerramos sesión
        console.error('Sesión caducada definitivamente:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;