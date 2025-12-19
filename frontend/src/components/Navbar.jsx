import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, X, User, LogOut, ChevronDown, 
  ShoppingBag, Settings, LayoutGrid 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false); 

  const isAdmin = user?.rol === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Helper para estilos de links (Soporte Dark Mode incluido)
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    const baseClasses = "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200";
    
    // Activo: Azul
    const activeClasses = "border-blue-600 text-blue-600 dark:text-blue-400";
    // Inactivo: Gris (oscuro en dark mode)
    const inactiveClasses = "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  // Helper para menú móvil
  const getMobileLinkClass = (path) => {
    const isActive = location.pathname === path;
    const baseClasses = "block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200";
    const activeClasses = "bg-blue-50 dark:bg-blue-900/20 border-blue-600 text-blue-700 dark:text-blue-400";
    const inactiveClasses = "border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800 dark:hover:text-white";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* 1. Logo y Navegación Principal */}
          <div className="flex items-center">
            <Link to="/home" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors shadow-sm">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-800 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Dulce<span className="text-blue-600 dark:text-blue-400 group-hover:text-gray-800 dark:group-hover:text-white">App</span>
              </span>
            </Link>

            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link to="/home" className={getLinkClass('/home')}>
                Inicio
              </Link>
            </div>
          </div>

          {/* 2. Menús Derecha */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* ADMIN MENU */}
            {isAdmin && (
              <div className="relative">
                <button 
                  onClick={() => { setIsAdminOpen(!isAdminOpen); setIsProfileOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isAdminRoute 
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 shadow-inner' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Settings className={`h-5 w-5 transition-transform duration-500 ${isAdminOpen ? 'rotate-90' : ''}`} />
                  <span>Admin</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isAdminOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Admin */}
                {isAdminOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 dark:ring-slate-700 focus:outline-none animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="px-4 py-2 border-b border-gray-50 dark:border-slate-700 mb-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gestión</p>
                    </div>
                    
                    <Link
                      to="/admin/categorias"
                      className={`flex items-center px-4 py-2.5 text-sm transition-colors ${
                        location.pathname === '/admin/categorias' 
                          ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                      onClick={() => setIsAdminOpen(false)}
                    >
                      <LayoutGrid className={`mr-3 h-4 w-4 ${location.pathname === '/admin/categorias' ? 'text-orange-500' : 'text-gray-400'}`} />
                      Categorías
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1"></div>

            {/* USER MENU */}
            <div className="relative">
              <button 
                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsAdminOpen(false); }}
                className={`flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-1 pr-3 border transition-all duration-200 ${
                  location.pathname === '/perfil' 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm' 
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 shadow-inner">
                  <User size={18} />
                </div>
                <span className="ml-3 text-gray-700 dark:text-gray-200 font-medium hidden lg:block">
                  {user?.nombre} {user?.apellido}
                </span>
                <ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown User */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-52 rounded-xl shadow-xl py-2 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 dark:ring-slate-700 focus:outline-none animate-in fade-in zoom-in-95 duration-200 z-50 border border-gray-100 dark:border-slate-700">
                  <div className="px-4 py-2 border-b border-gray-50 dark:border-slate-700 mb-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mi Cuenta</p>
                    <p className="text-xs text-gray-900 dark:text-white font-medium truncate">{user?.email}</p>
                  </div>
                  
                  <Link
                    to="/perfil"
                    className={`flex items-center px-4 py-2.5 text-sm transition-colors ${
                      location.pathname === '/perfil' 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className={`mr-3 h-4 w-4 ${location.pathname === '/perfil' ? 'text-blue-500' : 'text-gray-400'}`} />
                    Mi Perfil
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Menú Móvil (Hamburguesa) */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navegación Móvil Desplegable */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/home"
              className={getMobileLinkClass('/home')}
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            
            {isAdmin && (
              <div className="space-y-1">
                <div className="pl-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">Panel Admin</div>
                <Link
                  to="/admin/categorias"
                  className={getMobileLinkClass('/admin/categorias')}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categorías
                </Link>
              </div>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
            <div className="flex items-center px-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                <User size={20} />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 dark:text-white">{user?.nombre} {user?.apellido}</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                to="/perfil"
                className="block px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Mi Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;