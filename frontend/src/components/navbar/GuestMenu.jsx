import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

const GuestMenu = () => {
  return (
    <div className="flex items-center gap-3">
      <Link
        to="/login"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-biskoto dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-all"
      >
        <LogIn size={18} />
        <span className="hidden sm:inline">Iniciar Sesión</span>
      </Link>
      
      <Link
        to="/registro"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-biskoto hover:bg-biskoto-600 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
      >
        <UserPlus size={18} />
        <span>Registrarse</span>
      </Link>
    </div>
  );
};

export default GuestMenu;