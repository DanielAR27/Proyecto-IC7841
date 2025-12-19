import api from './axiosConfig';

export const getMiPerfil = async () => {
  const response = await api.get('/perfiles/me');
  return response.data;
};

export const actualizarPerfil = async (datos) => {
  const response = await api.patch('/perfiles/update', datos);
  return response.data;
};