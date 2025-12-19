import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import CategoriaForm from '../../components/admin/CategoriaForm'; 
import * as categoriaService from '../../api/categoriaService';
import { LayoutGrid, ArrowLeft } from 'lucide-react';

const CrearCategoriaPage = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Llamada al Backend
      await categoriaService.createCategoria(formData);
      
      // 2. Redirección con mensaje de éxito (Banner)
      navigate('/admin/categorias', { 
        state: { successMessage: 'Se ha creado una nueva categoría correctamente.' } 
      });
      
    } catch (err) {
      // Manejo de errores del backend
      const msg = err.response?.data?.error || err.message || 'Error al crear la categoría.';
      setError(msg);
    } finally {
      setLoading(false);
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
            Nueva Categoría
          </h1>
        </div>

        {/* USO DEL COMPONENTE REUTILIZABLE 
            Nota: No se pasa 'initialData' porque se quiere que empiece vacío.
        */}
        <CategoriaForm 
          onSubmit={handleCreate} 
          loading={loading}
          error={error}
          buttonText="Crear Categoría"
        />

      </main>
    </div>
  );
};

export default CrearCategoriaPage;