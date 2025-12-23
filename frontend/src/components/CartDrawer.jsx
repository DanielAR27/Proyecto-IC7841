import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Trash2, Plus, Minus, ShoppingBag, 
  ArrowRight, AlertCircle, Loader2, RefreshCw 
} from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * Componente que representa el panel lateral del carrito de compras.
 * Gestiona la visualización de items y la validación final antes del checkout.
 */
const CartDrawer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Extraemos 'sincronizarCarrito' para usarlo manualmente en el checkout
  const { 
    cart, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    addToCart,
    totalPrice,
    isSyncing,
    limpiarAgotados,
    sincronizarCarrito 
  } = useCart();

  const drawerRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeCart]);

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1 || item.status === 'agotado') return;

    if (item.maxStock !== undefined && newQuantity > item.maxStock) {
      return;
    }

    addToCart({
      ...item,
      cantidad: newQuantity - item.quantity
    });
  };

  /**
   * Maneja la entrada manual de números en el input.
   * Si el usuario escribe más del stock disponible, lo ajusta al máximo automáticamente.
   */
  const handleManualInput = (e, item) => {
    let val = parseInt(e.target.value);

    // Si borran todo o escriben algo inválido, no hacemos nada (o podríamos forzar 1)
    if (isNaN(val) || val < 1) return;

    // Si intentan escribir más del stock permitido, lo topamos al máximo
    if (item.maxStock !== undefined && val > item.maxStock) {
      val = item.maxStock;
    }

    // Solo actualizamos si el valor cambió
    if (val !== item.quantity) {
      handleQuantityChange(item, val);
    }
  };

  /**
   * Manejador del Checkout (El "Portero").
   * CAMBIO: Ahora es ASÍNCRONO.
   * Antes de navegar, fuerza una validación contra el servidor.
   * Si el stock cambió en el último segundo, detiene al usuario y actualiza la UI.
   */
  const handleCheckout = async () => {
    // 1. Verificación rápida local (si ya hay rojos visibles, no hacemos llamada)
    const tieneAgotadosVisuales = cart.some(item => item.status === 'agotado');
    if (tieneAgotadosVisuales) return;

    // 2. Validación de "Último Segundo" contra el Backend
    // Esto disparará el estado 'isSyncing' (mostrando spinner en el botón)
    const validacionExitosa = await sincronizarCarrito(cart);

    // 3. Toma de decisión
    if (!validacionExitosa) {
      // Si retorna false, significa que hubo conflictos (stock bajó).
      // El contexto ya actualizó el carrito visualmente con los mensajes de error.
      // Detenemos la navegación y alertamos al usuario.
      alert('El inventario ha cambiado. Hemos ajustado las cantidades a lo disponible.');
      return; 
    }

    // 4. Si todo está verde, procedemos
    closeCart();
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: '/checkout' } });
    }
  };

  // Determina si el botón debe estar habilitado visualmente
  const canCheckout = !isSyncing && cart.length > 0 && !cart.some(item => item.status === 'agotado');

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="text-biskoto" size={24} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-biskoto text-[10px] font-bold text-white">
                      {cart.filter(i => i.status !== 'agotado').length}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Tu Pedido</h2>
                {isSyncing && <Loader2 className="h-4 w-4 text-biskoto animate-spin ml-2" />}
              </div>
              <button onClick={closeCart} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-400">
                <X size={24} />
              </button>
            </div>

            {/* Listado de Productos */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <ShoppingBag size={40} className="text-gray-300" />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Tu carrito está vacío</p>
                  <button onClick={closeCart} className="text-biskoto font-bold text-sm uppercase tracking-widest hover:underline">Ver Menú</button>
                </div>
              ) : (
                <>
                  {cart.some(item => item.status === 'agotado') && (
                    <button 
                      onClick={limpiarAgotados}
                      className="w-full py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                    >
                      <RefreshCw size={14} /> Limpiar productos agotados
                    </button>
                  )}

                  {cart.map((item) => (
                    <div key={item.id} className={`flex gap-4 group ${item.status === 'agotado' ? 'opacity-60' : ''}`}>
                      <div className={`relative h-24 w-24 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 ${item.status === 'agotado' ? 'grayscale' : ''}`}>
                        <img src={item.imagen || '/placeholder.png'} alt={item.nombre} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{item.nombre}</h3>
                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors ml-2"><Trash2 size={18} /></button>
                          </div>
                          
                          {/* Alerta visual para productos ajustados o agotados */}
                          {item.status !== 'ok' && (
                            <div className={`flex items-center gap-1.5 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md w-fit ${
                              item.status === 'agotado' 
                                ? 'text-red-600 bg-red-50 dark:bg-red-900/20' 
                                : 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'
                            }`}>
                              <AlertCircle size={10} /> {item.mensajeError}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1 border border-gray-200 dark:border-slate-700">
                            {/* Botón Menos */}
                            <button 
                              onClick={() => handleQuantityChange(item, item.quantity - 1)} 
                              disabled={item.status === 'agotado'}
                              className="p-1 hover:text-biskoto transition-colors dark:text-white disabled:opacity-30"
                            >
                              <Minus size={14} />
                            </button>

                            {/* INPUT MANUAL: Reemplaza al <span> */}
                            <input
                              type="number"
                              min="1"
                              max={item.maxStock}
                              value={item.quantity}
                              onChange={(e) => handleManualInput(e, item)}
                              disabled={item.status === 'agotado'}
                              className="w-12 text-center bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-900 dark:text-white p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />

                            {/* Botón Más */}
                            <button 
                              onClick={() => handleQuantityChange(item, item.quantity + 1)} 
                              disabled={item.status === 'agotado' || (item.maxStock !== undefined && item.quantity >= item.maxStock)}
                              className="p-1 hover:text-biskoto transition-colors dark:text-white disabled:opacity-30"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className={`font-bold ${item.status === 'agotado' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                            {new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format((item.price || item.precio) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Footer con botón de validación */}
            {cart.length > 0 && (
              <div className="p-6 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Subtotal</span>
                  <span className="text-2xl font-black text-gray-900 dark:text-white">
                    {new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(totalPrice)}
                  </span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={!canCheckout}
                  className="w-full py-4 bg-biskoto hover:bg-biskoto-700 disabled:bg-gray-300 text-white rounded-xl font-bold text-lg shadow-lg shadow-biskoto/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Verificando Stock...
                    </>
                  ) : cart.some(item => item.status === 'agotado') ? (
                    <>Elimina los productos sin stock</>
                  ) : (
                    <>
                      {user ? 'Procesar Compra' : 'Iniciar Sesión para Pagar'}
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;