import { Search } from 'lucide-react';

const TableSearch = ({ 
  searchTerm, 
  setSearchTerm, 
  placeholder = "Buscar...", 
  resultCount 
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-t-xl border-b border-gray-200 dark:border-slate-700 flex items-center justify-between shadow-sm transition-colors duration-300">
      <div className="relative max-w-xs w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg leading-5 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-biskoto focus:border-biskoto sm:text-sm transition duration-150 ease-in-out"
          placeholder={placeholder}
        />
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
        Mostrando <span className="font-medium text-gray-900 dark:text-white">{resultCount}</span> resultados
      </div>
    </div>
  );
};

export default TableSearch;