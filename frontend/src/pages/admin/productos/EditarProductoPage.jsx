import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import ProductoForm from '../../../components/admin/ProductoForm';
import { getProducto, updateProducto } from '../../../api/productoService'; // Nombres corregidos
import { Package, ArrowLeft, Loader2 } from 'lucide-react';

const EditarProductoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const data = await getProducto(id); // Función corregida
        setProducto(data);
      } catch (err) {
        console.error("Error al cargar producto:", err);
        setError("No se pudo cargar la información del producto.");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      await updateProducto(id, formData); // Función corregida
      
      navigate('/admin/productos', { 
        state: { successMessage: `El producto "${formData.nombre}" se actualizó correctamente.` } 
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar los cambios.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-biskoto h-12 w-12 mb-4" />
        <p className="text-gray-500 dark:text-white font-medium">Cargando producto...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/admin/productos" className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-biskoto mb-4 group">
            <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Volver al listado
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-biskoto/10 rounded-2xl">
              <Package className="h-8 w-8 text-biskoto" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Editar Producto</h1>
              {/* Observación 1: Se eliminó la etiqueta del ID aquí */}
            </div>
          </div>
        </div>

        <ProductoForm 
          initialData={producto} 
          onSubmit={handleUpdate} 
          loading={submitting} 
          error={error} 
          buttonText="Guardar Cambios"
        />
      </main>
    </div>
  );
};

export default EditarProductoPage;