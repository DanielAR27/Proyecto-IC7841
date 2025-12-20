import api from './axiosConfig';

/**
 * Solicita al backend una URL firmada para subir un archivo.
 */
export const getSignedUploadUrl = async (fileName) => {
  const response = await api.post('/storage/sign-upload', { fileName });
  return response.data;
};