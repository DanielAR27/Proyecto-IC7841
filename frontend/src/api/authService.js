import api from './axiosConfig';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registrar = async (userData) => {
  const response = await api.post('/auth/registrar', userData);
  return response.data;
};

export const recuperarPassword = async (email) => {
  // Se calcula la URL de retorno dinámicamente (localhost o producción)
  const redirectTo = `${window.location.origin}/actualizar-password`;
  const response = await api.post('/auth/recuperar-password', { email, redirectTo });
  return response.data;
};

export const updatePassword = async (newPassword) => {
  // Solo se envía la contraseña.
  const response = await api.post('/auth/actualizar-password', { password: newPassword });
  return response.data;
};