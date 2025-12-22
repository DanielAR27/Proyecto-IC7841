import api from './axiosConfig';

/**
 * Obtiene el listado completo de cupones (Solo Admin).
 */
export const getCupones = async () => {
  const response = await api.get('/cupones');
  return response.data;
};

/**
 * Obtiene los detalles de un cupón específico por su ID.
 */
export const obtenerCupon = async (id) => {
  const response = await api.get(`/cupones/${id}`);
  return response.data;
};

/**
 * Crea un nuevo cupón en el sistema.
 */
export const createCupon = async (cupon) => {
  const response = await api.post('/cupones', cupon);
  return response.data;
};

/**
 * Actualiza la información de un cupón existente.
 */
export const updateCupon = async (id, cupon) => {
  const response = await api.put(`/cupones/${id}`, cupon);
  return response.data;
};

/**
 * Elimina un cupón permanentemente.
 */
export const deleteCupon = async (id) => {
  const response = await api.delete(`/cupones/${id}`);
  return response.data;
};

/**
 * Valida un código de cupón para aplicarlo en una compra.
 * Verifica existencia, fecha de expiración y estado activo.
 */
export const validarCupon = async (codigo) => {
  // Enviamos el código en el cuerpo de la petición
  const response = await api.post('/cupones/validar', { codigo });
  return response.data;
};