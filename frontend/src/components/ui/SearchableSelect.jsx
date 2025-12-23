import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';

const SearchableSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Seleccionar...", 
  className = "",
  // NUEVAS PROPS CON VALORES POR DEFECTO (Estilo Formulario Principal)
  bgClasses = "bg-gray-50 dark:bg-slate-900", 
  pyClasses = "py-3"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(o => String(o.value) === String(value));

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {/* TRIGGER */}
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        // AQUI USAMOS LAS VARIABLES EN VEZ DE CLASES FIJAS
        className={`w-full ${bgClasses} ${pyClasses} border border-gray-300 dark:border-slate-600 rounded-xl px-4 flex items-center justify-between cursor-pointer transition-all shadow-sm ${isOpen ? 'ring-2 ring-biskoto border-transparent' : 'hover:border-gray-400'}`}
      >
        <span className={`block truncate ${selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* DROPDOWN (Esto se queda igual) */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 sticky top-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" autoFocus placeholder="Buscar..." className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg pl-9 pr-8 py-2 text-sm outline-none focus:border-biskoto focus:ring-1 focus:ring-biskoto dark:text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={14} /></button>}
            </div>
          </div>
          <ul className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li key={option.value} onClick={() => handleSelect(option.value)} className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between transition-colors ${String(value) === String(option.value) ? 'bg-biskoto/10 text-biskoto dark:bg-biskoto/20 dark:text-white font-bold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'}`}>
                  <div className="flex flex-col"><span>{option.label}</span>{option.subLabel && <span className="text-[10px] text-gray-400 font-normal uppercase">{option.subLabel}</span>}</div>
                  {String(value) === String(option.value) && <Check size={16} />}
                </li>
              ))
            ) : <li className="px-4 py-8 text-center text-sm text-gray-400 italic">No hay resultados</li>}
          </ul>
        </div>
      )}
    </div>
  );
};
export default SearchableSelect;