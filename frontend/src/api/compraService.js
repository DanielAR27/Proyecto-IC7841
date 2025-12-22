import api from './axiosConfig';

/**
 * Obtiene el historial completo de compras registradas en el sistema.
 * Retorna un resumen que incluye el ID, fecha, total y nombre del proveedor.
 */
export const getCompras = async () => {
  const response = await api.get('/compras');
  return response.data;
};

/**
 * Recupera el detalle técnico de una compra específica.
 * Incluye la lista de ingredientes (items) adquiridos, cantidades y precios unitarios.
 */
export const getCompraById = async (id) => {
  const response = await api.get(`/compras/${id}`);
  return response.data;
};

/**
 * Registra una nueva transacción de compra de suministros.
 * Esta operación dispara el trigger en la base de datos para aumentar el stock 
 * de los ingredientes vinculados.
 */
export const createCompra = async (compraData) => {
  const response = await api.post('/compras', compraData);
  return response.data;
};

/**
 * Elimina un registro de compra del historial.
 * Al eliminarse, el sistema revierte automáticamente el stock de los ingredientes
 * asociados a esta compra.
 */
export const deleteCompra = async (id) => {
  const response = await api.delete(`/compras/${id}`);
  return response.data;
};