import { Link, useLocation } from 'react-router-dom';
import { User, LogIn, UserPlus, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // Importamos el contexto

const MobileMenu = ({ isOpen, setIsOpen, user, logout, isAdmin }) => {
  const location = useLocation();
  const { totalItems } = useCart(); // Leemos el total del carrito

  if (!isOpen) return null;

  const getMobileLinkClass = (path) => {
    const isActive = location.pathname === path;
    const baseClasses = "block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200";
    
    return isActive 
      ? `${baseClasses} bg-biskoto-50 border-biskoto text-biskoto dark:bg-white/10 dark:text-white dark:border-white`
      : `${baseClasses} border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-800 dark:hover:text-white`;
  };

  return (
    <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-200">
      
      {/* Navegación Principal */}
      <div className="pt-2 pb-3 space-y-1">
        <Link to="/home" className={getMobileLinkClass('/home')} onClick={() => setIsOpen(false)}>
          Inicio
        </Link>
        
        {/* Enlace al Carrito (Visible para todos) */}
        <Link 
          to="/carrito" 
          className={getMobileLinkClass('/carrito')} 
          onClick={() => setIsOpen(false)}
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingCart size={18} />
              {/* Badge rojo si hay items */}
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900">
                  <span className="text-[9px] font-bold text-white leading-none">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                </span>
              )}
            </div>
            <span>Mi Carrito</span>
          </div>
        </Link>
        
        {/* Enlaces de Admin */}
        {isAdmin && (
          <div className="space-y-1 mt-4">
            <div className="pl-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              Panel Admin
            </div>
            {[
              { path: '/admin/categorias', label: 'Categorías' },
              { path: '/admin/productos', label: 'Productos' },
              { path: '/admin/ingredientes', label: 'Ingredientes' },
              { path: '/admin/cupones', label: 'Cupones' },
              { path: '/admin/usuarios', label: 'Usuarios' },
              { path: '/admin/proveedores', label: 'Proveedores' },
              { path: '/admin/compras', label: 'Compras' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={getMobileLinkClass(item.path)}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer del Menú (Perfil o Login) */}
      <div className="pt-4 pb-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
        {user ? (
          // Vista Usuario Logueado
          <>
            <div className="flex items-center px-4">
              <div className="h-10 w-10 rounded-full bg-biskoto/10 flex items-center justify-center text-biskoto dark:bg-white/10 dark:text-white">
                <User size={20} />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 dark:text-white">
                  {user.nombre} {user.apellido}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                  {user.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                to="/perfil"
                className="block px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                onClick={() => setIsOpen(false)}
              >
                Mi Perfil
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left block px-4 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                Cerrar Sesión
              </button>
            </div>
          </>
        ) : (
          // Vista Invitado (Guest)
          <div className="px-4 space-y-3">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </Link>
            <Link
              to="/registro"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-biskoto rounded-lg hover:bg-biskoto-600"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;