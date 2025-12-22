import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  // Inicializamos el carrito leyendo del localStorage si existe
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem('biskoto_cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      return [];
    }
  });

  // Cada vez que el carrito cambie, guardamos en localStorage
  useEffect(() => {
    localStorage.setItem('biskoto_cart', JSON.stringify(cart));
  }, [cart]);

  // Función: Agregar Item
  const addToCart = (product, quantity) => {
    setCart(prevCart => {
      // ¿El producto ya existe?
      const existingItem = prevCart.find(item => item.id === product.id);

      if (existingItem) {
        // Si existe, sumamos la cantidad
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si no existe, lo agregamos nuevo
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // Función: Remover Item
  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Función: Limpiar todo
  const clearCart = () => setCart([]);

  // Calculamos el total de items (ej: 3 galletas + 2 pasteles = 5 items)
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Calculamos el precio total
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      totalItems,
      totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
};