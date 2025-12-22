import { 
  Cookie, Cake, Coffee, Utensils, Star, Heart, 
  Croissant, Donut, IceCream, Candy 
} from 'lucide-react';

/**
 * Componente que genera un fondo decorativo con un patrón de íconos simétrico.
 * Ahora soporta MODO OSCURO (Dark Mode).
 */
const IconBackground = ({ children }) => {
  // Repertorio ampliado de íconos disponibles
  const iconPool = [
    Cookie, Cake, Coffee, Utensils, Star, Heart, 
    Croissant, Donut, IceCream, Candy
  ];

  // Patrones de rotación para alternar entre los íconos
  const rotations = [
    'rotate-12', '-rotate-12', 'rotate-[30deg]', 
    '-rotate-[20deg]', 'rotate-45', '-rotate-45'
  ];

  // Configuración de la cuadrícula (densidad)
  const columns = 6;
  const rows = 6;
  const totalIcons = columns * rows;

  /**
   * Generación dinámica de íconos
   */
  const generatedIcons = Array.from({ length: totalIcons }).map((_, index) => {
    const IconComponent = iconPool[index % iconPool.length];
    const rotationClass = rotations[(index + Math.floor(index / columns)) % rotations.length];
    return { Icon: IconComponent, rotation: rotationClass };
  });

  return (
    // CAMBIO 1: Agregado 'dark:bg-slate-950' y 'transition-colors' para suavizar el cambio
    <div className="relative min-h-screen w-full bg-gray-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      
      {/* Capa de fondo Grid */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.04] dark:opacity-[0.05] grid grid-cols-6 grid-rows-6 justify-items-center items-center p-8">
        {generatedIcons.map(({ Icon, rotation }, index) => (
          <Icon
            key={index}
            // CAMBIO 2: Los íconos ahora son blancos en modo oscuro (dark:text-white)
            // CAMBIO 3: El hover también se adapta (dark:hover:text-blue-300/20)
            className={`w-12 h-12 text-gray-900 dark:text-white ${rotation} transition-transform duration-300 hover:scale-110 hover:text-blue-900/20 dark:hover:text-blue-300/20`}
          />
        ))}
      </div>

      {/* Contenido principal de la página */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default IconBackground;