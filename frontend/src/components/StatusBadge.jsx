/**
 * Badge de estado reutilizable.
 * @param {string} variant - 'success' | 'error' | 'warning' | 'info' | 'brand' | 'default'
 */
const StatusBadge = ({ children, variant = 'default' }) => {
  const variants = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
    error: 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    brand: 'bg-biskoto-50 text-biskoto border-biskoto/20 dark:bg-white/10 dark:text-white dark:border-white/30', // Tu color personalizado
    default: 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300 border-gray-200 dark:border-slate-600'
  };

  const className = variants[variant] || variants.default;

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${className}`}>
      {children}
    </span>
  );
};

export default StatusBadge;