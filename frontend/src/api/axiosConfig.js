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
 * Se añade una validación para evitar el redireccionamiento si el error 
 * proviene del endpoint de login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config.url.includes('/auth/login');

    // Solo se redirige si es un error 401 y NO es una petición de login
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;