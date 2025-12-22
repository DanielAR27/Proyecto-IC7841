import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartWidget = () => {
  const { totalItems } = useCart();

  return (
    <Link 
      to="/carrito" 
      className="relative group" // Quitamos hover/active aquí, lo maneja el div interno para consistencia
      title="Ver mi carrito"
    >
      {/* 1. El Círculo Contenedor (Estilos copiados de ThemeToggleBtn) */}
      <div className="p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:scale-110 transition-all duration-300 group-hover:text-biskoto dark:group-hover:text-white">
        {/* Aumentamos el ícono a 24 (size={24}) para igualar al Sun/Moon */}
        <ShoppingCart size={24} />
      </div>

      {/* 2. El Badge (Contador) */}
      {totalItems > 0 && (
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 animate-in zoom-in duration-300 pointer-events-none">
          <span className="text-[10px] font-bold text-white leading-none">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        </div>
      )}
    </Link>
  );
};

export default CartWidget;