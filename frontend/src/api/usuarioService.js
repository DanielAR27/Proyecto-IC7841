import api from './axiosConfig';

/**
 * Solicita el listado de usuarios operativos.
 * El backend se encarga de filtrar automáticamente aquellos que han sido 
 * marcados con 'Soft Delete' (inactivos o eliminados), retornando solo los vigentes.
 */
export const getUsuarios = async () => {
  const response = await api.get('/usuarios');
  return response.data;
};

/**
 * El desarrollador recupera la información completa de un usuario por su ID.
 * Este método es capaz de traer incluso usuarios inactivos, permitiendo 
 * cargar sus datos en el formulario para una eventual reactivación o auditoría.
 */
export const obtenerUsuario = async (id) => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
};

/**
 * Envía las modificaciones del perfil al servidor.
 * Ahora este método soporta la lógica de 'Reactivación': si se envía 
 */
export const updateUsuario = async (id, usuario) => {
  const response = await api.put(`/usuarios/${id}`, usuario);
  return response.data;
};

/**
 * Aunque el verbo HTTP es DELETE, el sistema ejecuta un 'Soft Delete':
 * marca al usuario como inactivo en la base de datos y bloquea su acceso en Supabase Auth,
 * preservando el historial de pedidos y datos relacionales.
 */
export const deleteUsuario = async (id) => {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
};