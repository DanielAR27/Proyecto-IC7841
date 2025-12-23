import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Save, AlertCircle, Info, Package, ChevronDown, Loader2 } from 'lucide-react';
import * as unidadService from '../../api/unidadService';

const IngredienteForm = ({ 
  initialData, 
  onSubmit, 
  loading: submitting, 
  error, 
  buttonText = 'Guardar' 
}) => {
  
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({ nombre: '', unidad_id: '', stock_actual: 0 });
  
  // Estados para el catálogo de unidades
  const [unidades, setUnidades] = useState([]);
  const [fetchingData, setFetchingData] = useState(true); // Carga inicial de catálogos

  // 1. Carga de catálogo de unidades al montar
  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        setFetchingData(true);
        const data = await unidadService.getUnidades();
        setUnidades(data);
      } catch (err) {
        console.error("Error al cargar unidades:", err);
      } finally {
        // Un pequeño delay artificial para evitar parpadeos si la red es ultra rápida
        setFetchingData(false);
      }
    };
    cargarCatalogos();
  }, []);

  // 2. Sincronización de datos iniciales cuando initialData cambie
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        unidad_id: initialData.unidad_id || '',
        stock_actual: initialData.stock_actual || 0,
        es_ilimitado: initialData.es_ilimitado || false
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.unidad_id) return;
    onSubmit(formData);
  };

  // ESTADO DE CARGA INICIAL: Si estamos trayendo las unidades, mostramos un loader limpio
  if (fetchingData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-8 w-8 text-biskoto animate-spin" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Preparando formulario...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
      )}

      {isEditing && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">Gestión de Inventario</h4>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              El stock no puede modificarse manualmente. Se actualiza mediante <strong>Compras</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Campo: Nombre */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Nombre del Ingrediente <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          placeholder="Ej: Harina de Trigo, Huevos..."
          className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-biskoto outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campo: Unidad de Medida */}
        <div>
          <label htmlFor="unidad_id" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Unidad de Medida <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="unidad_id"
              name="unidad_id"
              value={formData.unidad_id}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-biskoto outline-none transition-all"
            >
              <option value="">Seleccionar unidad...</option>
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre} ({u.abreviatura})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        {/* Campo: Stock (Solo en edición Y si NO es ilimitado) */}
        {isEditing && !formData.es_ilimitado && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
              <Package size={16} /> Stock Actual
            </label>
            <div className="relative">
                <input
                type="number"
                value={formData.stock_actual}
                disabled
                className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-gray-500 dark:text-gray-400 cursor-not-allowed font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* Opción de Stock Ilimitado */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
        <input
          type="checkbox"
          id="es_ilimitado"
          name="es_ilimitado"
          checked={formData.es_ilimitado}
          onChange={handleChange}
          className="h-5 w-5 rounded border-gray-300 text-biskoto focus:ring-biskoto"
        />
        <div>
          <label htmlFor="es_ilimitado" className="text-sm font-bold text-gray-900 dark:text-white cursor-pointer select-none">
            Ingrediente de consumo ilimitado
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Útil para insumos como agua o gas. No se validará su stock ni requerirá compras.
          </p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="pt-6 flex items-center justify-end gap-4 border-t border-gray-100 dark:border-slate-800">
        <Link
          to="/admin/ingredientes"
          className="px-6 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center px-8 py-2.5 text-sm font-bold text-white bg-biskoto rounded-lg hover:bg-biskoto-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-biskoto disabled:opacity-50 transition-all shadow-lg shadow-biskoto/20"
        >
          {submitting ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <Save size={18} className="mr-2" />
              {buttonText}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default IngredienteForm;