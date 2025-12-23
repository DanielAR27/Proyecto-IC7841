import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartWidget = () => {
  // Extraemos totalItems y la función para abrir/cerrar el Drawer
  const { totalItems, toggleCart } = useCart();

  const handleToggle = (e) => {
    // Evitamos que el clic se propague a otros elementos de la Navbar
    e.preventDefault();
    e.stopPropagation();
    toggleCart();
  };

  return (
    <button 
      type="button" // Definimos explícitamente como botón
      onClick={handleToggle} 
      className="relative group focus:outline-none flex items-center justify-center" 
      title="Ver mi pedido"
    >
      {/* Contenedor del Icono */}
      <div className="p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-all duration-300 group-hover:text-biskoto dark:group-hover:text-white">
        <ShoppingCart size={24} />
      </div>

      {/* Badge del Contador */}
      {totalItems > 0 && (
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900 animate-in zoom-in duration-300 pointer-events-none">
          <span className="text-[10px] font-bold text-white leading-none">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        </div>
      )}
    </button>
  );
};

export default CartWidget;