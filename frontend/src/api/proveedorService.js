import api from './axiosConfig';

export const getProveedores = async () => {
  const response = await api.get('/proveedores');
  return response.data;
};

export const obtenerProveedor = async (id) => {
  const response = await api.get(`/proveedores/${id}`);
  return response.data;
};

export const createProveedor = async (proveedor) => {
  const response = await api.post('/proveedores', proveedor);
  return response.data;
};

export const updateProveedor = async (id, proveedor) => {
  const response = await api.put(`/proveedores/${id}`, proveedor);
  return response.data;
};

export const deleteProveedor = async (id) => {
  const response = await api.delete(`/proveedores/${id}`);
  return response.data;
};