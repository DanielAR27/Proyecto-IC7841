import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import CategoriaForm from '../../components/admin/CategoriaForm';
import * as categoriaService from '../../api/categoriaService';
import { LayoutGrid, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

const EditarCategoriaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // 1. Cargar datos
  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriaService.obtenerCategoria(id);
      setCategoria(data);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la información de la categoría.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Manejar la actualización con mensajes EXPLÍCITOS
  const handleUpdate = async (formData) => {
    setSaving(true);
    setError(null);
    try {
      await categoriaService.updateCategoria(id, formData);
      
      navigate('/admin/categorias', {
        state: { successMessage: 'Categoría actualizada correctamente.' }
      });
      
    } catch (err) {
      console.error("Error update:", err);

      let msg = err.response?.data?.error; // Intenta leer el mensaje del backend

      // Si el backend no mandó mensaje, se deduce por el código de estado
      if (!msg) {
        if (err.response?.status === 409) {
          msg = 'Ya existe otra categoría con este nombre. Intenta con uno diferente.';
        } else if (err.response?.status === 400) {
          msg = 'Los datos enviados no son válidos.';
        } else {
          msg = 'Ocurrió un error inesperado al actualizar. Intente nuevamente.';
        }
      }
      
      setError(msg); 
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="mb-8">
          <Link 
            to="/admin/categorias" 
            className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al listado
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-orange-500" />
            Editar Categoría
          </h1>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
            <Loader2 className="h-10 w-10 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando datos...</p>
          </div>
        ) : error && !categoria ? (
          <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-red-100 dark:border-red-900/50">
            <div className="inline-flex p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error de Carga</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
            <button 
              onClick={cargarDatos}
              className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Intentar Nuevamente
            </button>
          </div>
        ) : (
          <CategoriaForm 
            initialData={categoria} 
            onSubmit={handleUpdate} 
            loading={saving}
            error={error} // El componente Form mostrará este mensaje explícito en rojo
            buttonText="Guardar Cambios"
          />
        )}

      </main>
    </div>
  );
};

export default EditarCategoriaPage;