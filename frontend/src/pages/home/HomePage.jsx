import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * HomePage (Dashboard Principal)
 * * Punto de entrada para usuarios autenticados.
 * Muestra un resumen del perfil actual y accesos directos a los módulos del sistema
 * (Categorías, Productos, Pedidos) según el rol del usuario.
 */
const HomePage = () => {
  const { user } = useAuth();

  // Verificación de rol para renderizado condicional de tarjetas
  const isAdmin = user?.rol === 'admin';

  return (
    // Contenedor principal con transición suave de color para el cambio de tema
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Barra de Navegación Global */}
      <Navbar />

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* SECCIÓN: Bienvenida y Resumen de Sesión */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 mb-8 transition-colors duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Bienvenido/a, <span className="text-blue-600 dark:text-blue-400">{user?.nombre} {user?.apellido}</span>
              </h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">
                Has iniciado sesión como <span className="font-semibold text-gray-700 dark:text-gray-200 capitalize">{user?.rol || 'Cliente'}</span>.
              </p>
            </div>
            
            {/* Widget de Fecha Actual */}
            <div className="mt-4 md:mt-0 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-800">
              {new Date().toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* SECCIÓN: Grid de Accesos Directos (Módulos) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card: Gestión de Categorías (Visible solo para Admin o como acceso al catálogo) */}
          <Link to={isAdmin ? "/admin/categorias" : "/home"} className="block group">
            <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-900/50 transition-all duration-200 h-full">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    Categorías
                  </h3>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
                  {isAdmin 
                    ? "Gestiona las familias de productos, crea nuevas categorías y organiza el inventario." 
                    : "Explora nuestra variedad de dulces organizados por categorías."}
                </p>
                <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                  {isAdmin ? "Administrar" : "Ver catálogo"} <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>

          {/* Aquí se agregarán futuros módulos (Productos, Pedidos, Usuarios, etc.) */}

        </div>
      </main>
    </div>
  );
};

export default HomePage;