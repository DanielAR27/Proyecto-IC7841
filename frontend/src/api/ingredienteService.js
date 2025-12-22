import api from './axiosConfig';

export const getIngredientes = async () => {
  const response = await api.get('/ingredientes');
  return response.data;
};

export const obtenerIngrediente = async (id) => {
  const response = await api.get(`/ingredientes/${id}`);
  return response.data;
};

/**
 * Se actualiza la lógica para recibir el objeto con 'unidad_id'.
 */
export const createIngrediente = async (ingrediente) => {
  const response = await api.post('/ingredientes', ingrediente);
  return response.data;
};

/**
 * Se actualiza la lógica para actualizar mediante 'unidad_id'.
 */
export const updateIngrediente = async (id, ingrediente) => {
  const response = await api.put(`/ingredientes/${id}`, ingrediente);
  return response.data;
};

export const deleteIngrediente = async (id) => {
  const response = await api.delete(`/ingredientes/${id}`);
  return response.data;
};