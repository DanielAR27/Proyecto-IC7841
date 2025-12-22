import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

const ToastNotification = ({ type = 'success', message, onClose }) => {
  const isSuccess = type === 'success';

  return (
    <div className={`mb-6 p-4 rounded-xl border flex items-center justify-between shadow-sm animate-in slide-in-from-top-2 fade-in duration-300 ${
      isSuccess 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900 text-green-800 dark:text-green-300' 
        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900 text-red-800 dark:text-red-300'
    }`}>
      <div className="flex items-center">
        {isSuccess ? (
          <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0" />
        ) : (
          <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
        )}
        <span className="font-medium text-sm">{message}</span>
      </div>
      <button 
        onClick={onClose} 
        className="ml-4 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ToastNotification;