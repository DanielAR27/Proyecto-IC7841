import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggleBtn = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-yellow-400 hover:scale-110 transition-all duration-300 group ${className}`}
      title={theme === 'dark' ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {theme === 'dark' ? (
        <Sun className="h-6 w-6" />
      ) : (
        <Moon className="h-6 w-6 text-biskoto group-hover:text-biskoto-700" />
      )}
    </button>
  );
};

export default ThemeToggleBtn;