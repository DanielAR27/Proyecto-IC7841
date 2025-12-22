import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getProductosCatalogo } from '../../api/productoService';
import { Search, ShoppingCart, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

/**
 * Componente HomePage (Catálogo Público).
 * * Se encarga de renderizar la vista principal de la aplicación, mostrando un grid
 * de productos paginados. Utiliza parámetros de URL para gestionar el estado de 
 * la navegación (página actual y búsqueda), permitiendo compartir enlaces específicos.
 */
const HomePage = () => {
  const { user } = useAuth();
  
  // Se gestionan los parámetros de la URL (query strings)
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Se derivan los estados iniciales desde la URL
  const paginaActual = parseInt(searchParams.get('page') || '1', 10);
  const terminoBusqueda = searchParams.get('search') || '';

  // Estados locales para datos y carga
  const [productos, setProductos] = useState([]);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Efecto para la carga de datos.
   * Se ejecuta cada vez que cambian los parámetros de paginación o búsqueda en la URL.
   */
  useEffect(() => {
    const cargarCatalogo = async () => {
      setCargando(true);
      setError(null);
      try {
        // Se realiza la petición al backend con los filtros actuales
        const data = await getProductosCatalogo({
          page: paginaActual,
          limit: 20,
          search: terminoBusqueda
        });
        
        // Se asume que el backend devuelve { productos, totalPaginas, ... }
        setProductos(data.productos || []);
        setTotalPaginas(data.totalPaginas || 1);
      } catch (err) {
        console.error("Error cargando catálogo:", err);
        setError("No se pudieron cargar los productos. Intente nuevamente.");
      } finally {
        setCargando(false);
      }
    };

    cargarCatalogo();
  }, [paginaActual, terminoBusqueda]);

  /**
   * Manejador de búsqueda.
   * Actualiza la URL reseteando la página a 1 cuando el usuario busca algo nuevo.
   */
  const handleSearch = (e) => {
    e.preventDefault();
    const form = e.target;
    const nuevoTermino = form.search.value;
    
    setSearchParams({ search: nuevoTermino, page: 1 });
  };

  /**
   * Manejador de cambio de página.
   * Navega a la página solicitada manteniendo el término de búsqueda activo.
   */
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setSearchParams({ search: terminoBusqueda, page: nuevaPagina });
      // Se hace scroll suave al inicio de la lista
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      {/* Header / Hero Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {user ? `Hola de nuevo, ${user.nombre}` : 'Bienvenido a Biskoto'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {user 
              ? 'Aquí tienes nuestros productos más recientes seleccionados para ti.' 
              : 'Explora nuestra variedad de dulces y repostería artesanal.'}
          </p>

          {/* Barra de Herramientas (Búsqueda y Filtros) */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <form onSubmit={handleSearch} className="relative w-full sm:max-w-md">
              <input
                type="text"
                name="search"
                defaultValue={terminoBusqueda}
                placeholder="Buscar galletas, pasteles..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-biskoto focus:border-transparent transition-shadow"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
            
            {/* Aquí se podrían agregar más filtros (Categoría, Precio) en el futuro */}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Estado de Carga */}
        {cargando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-slate-800 rounded-xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
            <Filter className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay productos</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No encontramos coincidencias para "{terminoBusqueda}". Intenta con otro término.
            </p>
          </div>
        ) : (
          /* Grid de Productos */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productos.map((producto) => {
                  // Lógica para determinar imagen y estado de stock
                  const imagenPrincipal = producto.producto_imagenes?.find(img => img.es_principal)?.url 
                    || producto.producto_imagenes?.[0]?.url 
                    || 'https://placehold.co/300x300?text=Sin+Imagen';
                    
                  // Verificación profesional de inventario
                  const sinStock = producto.stock_actual <= 0;

                  return (
                    <div 
                      key={producto.id} 
                      className={`group bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col ${sinStock ? 'opacity-75 grayscale-[0.5]' : 'hover:border-biskoto/50'}`}
                    >
                      {/* Imagen del Producto */}
                      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-slate-900">
                        <img 
                          src={imagenPrincipal} 
                          alt={producto.nombre} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Etiqueta de Categoría */}
                        {producto.categorias && (
                          <span className="absolute top-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-slate-700">
                            {producto.categorias.nombre}
                          </span>
                        )}

                        {/* Etiqueta de AGOTADO (Nueva lógica) */}
                        {sinStock && (
                          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg transform -rotate-12 border-2 border-white dark:border-slate-800">
                              Agotado
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Información y Acciones */}
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-biskoto transition-colors">
                          {producto.nombre}
                        </h3>
                        
                        {/* Mostrar stock restante si queda poco (Opcional, crea urgencia) */}
                        {!sinStock && producto.stock_actual <= 5 && (
                          <p className="text-xs text-orange-500 font-medium mb-1">
                            ¡Solo quedan {producto.stock_actual}!
                          </p>
                        )}

                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
                          {producto.descripcion}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-slate-700">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            ₡{parseFloat(producto.precio).toLocaleString('es-CR')}
                          </span>
                          
                          {/* Botón de Acción Condicional */}
                          <button 
                            disabled={sinStock}
                            className={`p-2 rounded-lg transition-colors shadow-sm active:scale-95 flex items-center gap-2 ${
                              sinStock 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500' // Estilo deshabilitado
                                : 'bg-biskoto text-white hover:bg-biskoto-600' // Estilo activo
                            }`}
                            title={sinStock ? "No disponible temporalmente" : "Agregar al carrito"}
                            onClick={() => !sinStock && console.log(`Agregar ${producto.id}`)}
                          >
                            <ShoppingCart size={20} />
                            {/* Opcional: Texto en botón */}
                            {/* <span className="text-sm font-medium hidden sm:inline">{sinStock ? 'Sin Stock' : 'Agregar'}</span> */}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Página {paginaActual} de {totalPaginas}
                </span>

                <button
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  className="p-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;