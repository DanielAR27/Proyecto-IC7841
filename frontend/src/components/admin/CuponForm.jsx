import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Save, AlertCircle, Ticket, Calendar, Percent, 
  RefreshCw, CheckCircle2, XCircle 
} from 'lucide-react';

const CuponForm = ({ 
  initialData, 
  onSubmit, 
  loading, 
  error, 
  buttonText = 'Guardar Cupón' 
}) => {
  
  // Valores iniciales
  const defaultValues = {
    codigo: '',
    descuento_porcentaje: '',
    fecha_expiracion: '',
    activo: true
  };

  const [formData, setFormData] = useState(defaultValues);

  // Carga de datos en modo edición
  useEffect(() => {
    if (initialData) {
      setFormData({
        codigo: initialData.codigo || '',
        descuento_porcentaje: initialData.descuento_porcentaje || '',
        // Formateamos la fecha para que el input type="date" la lea bien (YYYY-MM-DD)
        fecha_expiracion: initialData.fecha_expiracion ? initialData.fecha_expiracion.split('T')[0] : '',
        activo: initialData.activo !== undefined ? initialData.activo : true
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // --- GENERADOR DE CÓDIGO ALEATORIO ---
  const generarCodigoAleatorio = () => {
    const longitud = 10; // "Cantidad máxima de tokens" (caracteres)
    const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sin I, 1, O, 0 para evitar confusión visual
    let resultado = '';
    for (let i = 0; i < longitud; i++) {
      resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    setFormData(prev => ({ ...prev, codigo: resultado }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convertimos el porcentaje a número antes de enviar
    const payload = {
      ...formData,
      descuento_porcentaje: Number(formData.descuento_porcentaje)
    };
    onSubmit(payload);
  };

  // Obtiene la fecha de hoy en formato local YYYY-MM-DD para el input date
  const getTodayString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-in fade-in duration-300">
      
      {/* Mensaje de Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50 flex items-center text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* CAMPO: CÓDIGO DEL CUPÓN + GENERADOR */}
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
              <Ticket size={16} className="text-biskoto" /> 
              Código del Cupón <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input 
                name="codigo" 
                type="text" 
                required 
                value={formData.codigo} 
                onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})} // Forzamos mayúsculas al escribir
                placeholder="Ej. VERANO2025" 
                className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-biskoto dark:text-white font-mono tracking-wider uppercase placeholder:normal-case placeholder:font-sans" 
              />
              <button
                type="button"
                onClick={generarCodigoAleatorio}
                className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 font-medium text-sm"
                title="Generar código aleatorio"
              >
                <RefreshCw size={18} />
                <span className="hidden sm:inline">Generar al azar</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Este es el código que el cliente deberá escribir en el carrito.
            </p>
          </div>

          {/* CAMPO: PORCENTAJE DE DESCUENTO */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
              <Percent size={16} /> 
              Porcentaje de Descuento <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input 
                name="descuento_porcentaje" 
                type="number" 
                min="1" 
                max="100" 
                required 
                value={formData.descuento_porcentaje} 
                onChange={handleChange} 
                placeholder="Ej. 15" 
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-biskoto dark:text-white pr-10" 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
            </div>
          </div>

{/* CAMPO: FECHA DE EXPIRACIÓN */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
              <Calendar size={16} /> 
              Fecha de Expiración (Opcional)
            </label>
            <input 
              name="fecha_expiracion" 
              type="date" 
              value={formData.fecha_expiracion} 
              onChange={handleChange} 
              
              // Se usa una función local
              min={getTodayString()} 
              
              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-biskoto dark:text-white dark:[color-scheme:dark]" 
            />
          </div>

          {/* CAMPO: ESTADO ACTIVO */}
          <div className="md:col-span-2 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="block text-sm font-bold text-gray-900 dark:text-white">Estado del Cupón</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formData.activo 
                  ? 'El cupón está habilitado y puede ser usado.' 
                  : 'El cupón está oculto y nadie podrá canjearlo.'}
              </span>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="activo" 
                checked={formData.activo} 
                onChange={handleChange} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-biskoto/20 dark:peer-focus:ring-biskoto/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-biskoto"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center gap-1">
                {formData.activo 
                  ? <><CheckCircle2 size={16} className="text-green-500" /> Activo</> 
                  : <><XCircle size={16} className="text-gray-400" /> Inactivo</>
                }
              </span>
            </label>
          </div>

        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-slate-700">
          <Link 
            to="/admin/cupones" 
            className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            Cancelar
          </Link>
          <button 
            type="submit" 
            disabled={loading} 
            className="bg-biskoto text-white px-8 py-3 rounded-xl font-bold hover:bg-biskoto-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-biskoto/20 transition-all"
          >
            <Save size={20} />
            {loading ? 'Guardando...' : buttonText}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CuponForm;