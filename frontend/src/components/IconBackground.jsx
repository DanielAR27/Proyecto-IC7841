import { 
  Cookie, Cake, Coffee, Utensils, Star, Heart, 
  Croissant, Donut, IceCream, Candy 
} from 'lucide-react';

/**
 * Componente que genera un fondo decorativo con un patrón de íconos simétrico.
 * Utiliza CSS Grid para ordenar los elementos y un iterador para poblarlos.
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
   * Se genera dinámicamente el arreglo de íconos basado en la cantidad total deseada.
   * Se utiliza el operador módulo (%) para ciclar a través del repertorio de íconos y rotaciones,
   * asegurando variedad y simetría.
   */
  const generatedIcons = Array.from({ length: totalIcons }).map((_, index) => {
    // Selección cíclica del ícono
    const IconComponent = iconPool[index % iconPool.length];
    
    // Selección cíclica de la rotación, desfasada para evitar patrones repetitivos verticales
    const rotationClass = rotations[(index + Math.floor(index / columns)) % rotations.length];

    return { Icon: IconComponent, rotation: rotationClass };
  });

  return (
    <div className="relative min-h-screen w-full bg-gray-50 overflow-hidden">
      {/* Capa de fondo Grid:
        - Se define una cuadrícula de 6 columnas y 6 filas.
        - justify-items-center y items-center centran cada ícono en su celda.
        - opacity-[0.04] reduce ligeramente la opacidad para compensar la mayor densidad.
      */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-[0.04] grid grid-cols-6 grid-rows-6 justify-items-center items-center p-8">
        {generatedIcons.map(({ Icon, rotation }, index) => (
          <Icon
            key={index}
            // Se reduce ligeramente el tamaño (w-12 h-12) para evitar saturación
            className={`w-12 h-12 text-gray-900 ${rotation} transition-transform duration-300 hover:scale-110 hover:text-blue-900/20`}
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