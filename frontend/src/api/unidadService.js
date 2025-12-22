import api from './axiosConfig';

/**
 * Recupera el catálogo maestro de unidades de medida (kg, g, ml, u, etc.).
 * Útil para poblar selectores en formularios de ingredientes y recetas.
 */
export const getUnidades = async () => {
  const response = await api.get('/unidades');
  return response.data;
};