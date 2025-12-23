import api from './axiosConfig';

/**
 * Obtiene el listado de productos para el catálogo público.
 * Incluye la relación completa de imágenes de cada producto.
 */
export const getProductosCatalogo = async (params = {}) => {
  // params puede contener { page: 1, limit: 20, search: 'galleta' }
  const response = await api.get('/productos', { params });
  return response.data;
};

/**
 * Obtiene el listado de productos optimizado para administración.
 * Este endpoint retorna datos básicos sin la carga de imágenes.
 */
export const getProductosAdmin = async () => {
  const response = await api.get('/productos/admin/listado');
  return response.data;
};

/**
 * Obtiene el detalle de un producto específico mediante su identificador.
 * La respuesta incluye los datos de categoría e imágenes asociadas.
 */
export const getProducto = async (id) => {
  const response = await api.get(`/productos/${id}`);
  return response.data;
};

/**
 * Envía la lista de productos del carrito al servidor para validar 
 * si existe disponibilidad física (insumos + stock) para procesar el pedido.
 */
export const validarDisponibilidad = async (items) => {
  const response = await api.post('/productos/validar-disponibilidad', { items });
  return response.data; // Si falla aquí, la promesa se rechaza automáticamente
};

/**
 * Registra un nuevo producto en el sistema.
 * El parámetro 'productoData' debe incluir el array de URLs de imágenes
 * previamente cargadas en el bucket de Supabase.
 */
export const createProducto = async (productoData) => {
  const response = await api.post('/productos', productoData);
  return response.data;
};

/**
 * Actualiza la información técnica de un producto existente.
 */
export const updateProducto = async (id, productoData) => {
  const response = await api.put(`/productos/${id}`, productoData);
  return response.data;
};

/**
 * Elimina un producto de la base de datos.
 * Las imágenes asociadas en la tabla producto_imagenes se eliminan por cascada.
 */
export const deleteProducto = async (id) => {
  const response = await api.delete(`/productos/${id}`);
  return response.data;
};