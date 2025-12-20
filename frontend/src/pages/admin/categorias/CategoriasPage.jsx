import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import * as categoriaService from '../../../api/categoriaService';
import { 
  Plus, Search, Pencil, Trash2, Package, 
  Loader2, CheckCircle2, X, AlertTriangle 
} from 'lucide-react';

const CategoriasPage = () => {
  const location = useLocation();
  
  // Estado para almacenar el listado de categorías y el término de búsqueda
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para controlar la interfaz de usuario (Carga, Errores y Notificaciones)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Estados para controlar el Modal de Eliminación
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); 

  // Carga inicial de datos al montar el componente
  useEffect(() => {
    cargarCategorias();
  }, []);

  // Detecta mensajes de éxito provenientes de otras rutas (ej. creación/edición)
  useEffect(() => {
    if (location.state?.successMessage) {
      showNotification('success', location.state.successMessage);
      // Limpia el estado del historial para evitar mostrar el mensaje al recargar
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Función auxiliar para mostrar notificaciones temporales
  const showNotification = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 5000);
  };

  // Obtiene el listado de categorías desde el servicio
  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const data = await categoriaService.getCategorias();
      setCategorias(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las categorías.');
    } finally {
      setLoading(false);
    }
  };

  // Abre el modal de confirmación estableciendo la categoría a eliminar
  const handleDeleteClick = (categoria) => {
    setCategoryToDelete(categoria);
  };

  // Ejecuta la eliminación de la categoría tras la confirmación del usuario
  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    setIsDeleting(true);
    try {
      // Solicita la eliminación al backend
      await categoriaService.deleteCategoria(categoryToDelete.id);
      
      // Actualiza el estado local filtrando la categoría eliminada
      setCategorias(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
      
      showNotification('success', `La categoría "${categoryToDelete.nombre}" ha sido eliminada.`);
      setCategoryToDelete(null); 
    } catch (err) {
      // Maneja errores de eliminación (ej. restricciones de clave foránea)
      const msg = err.response?.data?.error || 'No se pudo eliminar la categoría.';
      showNotification('error', msg);
      setCategoryToDelete(null); 
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtra las categorías en tiempo real según el término de búsqueda
  const categoriasFiltradas = categorias.filter((cat) => 
    cat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 relative">
      <Navbar />

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado de la Sección */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl flex items-center gap-2">
              {/* Icono actualizado a marca/blanco */}
              <Package className="h-8 w-8 text-biskoto dark:text-white" />
              Gestión de Categorías
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Administra las familias de productos de tu tienda.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              to="/admin/categorias/nueva"
              // Botón principal actualizado a Biskoto
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-biskoto hover:bg-biskoto-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-biskoto transition-colors"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Nueva Categoría
            </Link>
          </div>
        </div>

        {/* Componente de Notificación (Toast) */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between shadow-sm animate-in slide-in-from-top-2 fade-in duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900 text-green-800 dark:text-green-300' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900 text-red-800 dark:text-red-300'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0" /> : <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />}
              <span className="font-medium text-sm">{notification.text}</span>
            </div>
            <button 
              onClick={() => setNotification(null)} 
              className="ml-4 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Barra de Búsqueda y Filtrado */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-t-xl border-b border-gray-200 dark:border-slate-700 flex items-center justify-between shadow-sm transition-colors duration-300">
          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Focus ring actualizado a Biskoto
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg leading-5 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-biskoto focus:border-biskoto sm:text-sm transition duration-150 ease-in-out"
              placeholder="Buscar categoría..."
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando <span className="font-medium text-gray-900 dark:text-white">{categoriasFiltradas.length}</span> resultados
          </div>
        </div>

        {/* Tabla de Resultados */}
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 dark:border-slate-700 sm:rounded-b-xl bg-white dark:bg-slate-800 transition-colors duration-300">
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    {/* Loader actualizado a Biskoto */}
                    <Loader2 className="h-10 w-10 text-biskoto animate-spin mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando catálogo...</p>
                  </div>
                ) : error ? (
                  <div className="p-10 text-center text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/10">
                    <p>{error}</p>
                  </div>
                ) : categoriasFiltradas.length === 0 ? (
                  <div className="p-10 text-center text-gray-500 dark:text-gray-400">
                    <p>
                      {searchTerm 
                        ? `No se encontraron categorías que coincidan con "${searchTerm}".` 
                        : "No hay categorías registradas en el inventario."}
                    </p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                    <thead className="bg-gray-50 dark:bg-slate-900/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Descripción</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cant. Productos</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                      {categoriasFiltradas.map((cat) => (
                        <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {/* Avatar Iniciales: Biskoto en Light, Blanco en Dark (UX Corregido) */}
                              <div className="flex-shrink-0 h-10 w-10 bg-biskoto/10 dark:bg-white/10 rounded-full flex items-center justify-center text-biskoto dark:text-white font-bold uppercase border border-biskoto/20 dark:border-white/20">
                                {cat.nombre.charAt(0)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{cat.nombre}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 md:hidden">{cat.descripcion}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                            {cat.descripcion || <span className="italic text-gray-400 dark:text-gray-600">Sin descripción</span>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {/* Badge: Biskoto en Light, Texto Blanco en Dark */}
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                              (cat.productos?.[0]?.count || 0) > 0 
                                ? 'bg-biskoto-50 text-biskoto border-biskoto/20 dark:bg-white/10 dark:text-white dark:border-white/30' 
                                : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                            }`}>
                              {cat.productos?.[0]?.count || 0} items
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              {/* Botón Editar: Biskoto en Light, Blanco en Dark */}
                              <Link 
                                to={`/admin/categorias/editar/${cat.id}`} 
                                className="text-biskoto hover:text-biskoto-700 bg-biskoto-50 hover:bg-biskoto/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 p-2 rounded-lg transition-colors group border border-transparent dark:border-white/20"
                              >
                                <Pencil className="h-4 w-4" />
                              </Link>
                              
                              {/* Botón Eliminar: Mantiene Rojo (Semántica de Peligro) */}
                              <button 
                                onClick={() => handleDeleteClick(cat)}
                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 p-2 rounded-lg transition-colors group border border-transparent dark:border-red-900/50">
                                <Trash2 className="h-4 w-4" />
                              </button>

                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL DE CONFIRMACIÓN (Overlay) --- */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                ¿Eliminar categoría?
              </h3>
              
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Estás a punto de eliminar la categoría <span className="font-bold text-gray-800 dark:text-gray-200">"{categoryToDelete.nombre}"</span>. 
                <br className="hidden sm:block"/>¿Estás seguro de que quieres continuar?
              </p>

              <div className="flex items-center justify-center gap-4">
                {/* Botón NO (Cancelar) */}
                <button
                  onClick={() => setCategoryToDelete(null)}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  No, cancelar
                </button>

                {/* Botón SÍ (Eliminar) - Rojo Intenso */}
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    "Sí, eliminar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CategoriasPage;