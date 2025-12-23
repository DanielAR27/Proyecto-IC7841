import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, AlertCircle, Truck, Info, 
  Plus, Loader2, Trash2, ClipboardList, Eye, X
} from 'lucide-react';

import { getProveedores } from '../../api/proveedorService';
import { getIngredientes } from '../../api/ingredienteService';
import SearchableSelect from '../../components/ui/SearchableSelect';

/**
 * Formulario de Gestión de Compras e Inventario.
 * * Cambios realizados por el desarrollador:
 * 1. Reubicación del bloque "Entrada de Insumos" antes del detalle de la tabla.
 * 2. Corrección de la función de eliminación de ítems de la receta local.
 * 3. Implementación de validación visual y funcional en el botón de adición (+).
 */
const CompraForm = ({ 
  initialData, 
  onSubmit, 
  loading: submitting, 
  error: externalError,
  buttonText = 'Registrar Compra',
  isReadOnly = false 
}) => {
  const [formData, setFormData] = useState({
    proveedor_id: '',
    notas: '',
    monto_total: 0
  });

  const [proveedores, setProveedores] = useState([]);
  const [ingredientesDb, setIngredientesDb] = useState([]);
  const [itemsCompra, setItemsCompra] = useState([]);
  
  const [fetchingData, setFetchingData] = useState(!isReadOnly);
  const [localError, setLocalError] = useState(null);

  const [itemError, setItemError] = useState(null);

  const [selectedIngrediente, setSelectedIngrediente] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');

  // El sistema recupera los catálogos de proveedores e ingredientes al inicializar.
  useEffect(() => {
    if (!isReadOnly) {
      const cargarCatalogos = async () => {
        try {
          setFetchingData(true);
          const [provs, ings] = await Promise.all([
            getProveedores(),
            getIngredientes()
          ]);
          setProveedores(provs);
          setIngredientesDb(ings);
        } catch (err) {
          console.error("Error al sincronizar catálogos:", err);
        } finally {
          setFetchingData(false);
        }
      };
      cargarCatalogos();
    }
  }, [isReadOnly]);

  // Se sincronizan los datos iniciales si el componente se carga en modo edición o lectura.
  useEffect(() => {
    if (initialData) {
      setFormData({
        proveedor_id: initialData.proveedor_id,
        notas: initialData.notas || '',
        monto_total: initialData.monto_total
      });
      
      if (initialData.compra_items) {
        setItemsCompra(initialData.compra_items.map(item => {
          // Extraemos los datos de la relación anidada
          const uniNombre = item.ingredientes?.unidades_medida?.nombre || '';
          const uniAbrev = item.ingredientes?.unidades_medida?.abreviatura || '';
          
          return {
            id: item.ingrediente_id,
            nombre: item.ingredientes?.nombre,
            // Formateamos la cadena combinada
            unidad: uniNombre ? `${uniNombre} (${uniAbrev})` : uniAbrev,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario
          };
        }));
      }
    }
  }, [initialData]);

  // El componente recalcula el monto total automáticamente al detectar cambios en la lista de ítems.
  useEffect(() => {
    if (!isReadOnly) {
      const total = itemsCompra.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0);
      setFormData(prev => ({ ...prev, monto_total: total }));
    }
  }, [itemsCompra, isReadOnly]);

  // Desplazar hacia arriba automáticamente cuando cambia el estado de error
  useEffect(() => {
    if (localError || externalError) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [localError, externalError]);

  useEffect(() => {
    if (!fetchingData) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [fetchingData]);

  // Validación en tiempo real para habilitar la adición de ítems.
  const canAdd = selectedIngrediente && cantidad && Number(cantidad) > 0 && precioUnitario && Number(precioUnitario) > 0;

  // NUEVO: Variable calculada para saber si el ingrediente seleccionado exige enteros
  // Esto se recalcula cada vez que cambias el 'selectedIngrediente'
  const ingSeleccionadoObj = ingredientesDb.find(i => i.id === Number(selectedIngrediente));
  const requiereEnteros = ingSeleccionadoObj 
    ? ['u', 'doc'].includes(ingSeleccionadoObj.unidades_medida?.abreviatura?.toLowerCase())
    : false;

  const agregarItem = () => {
    if (!canAdd) return;
    
    // NUEVA VALIDACIÓN
    if (requiereEnteros && !Number.isInteger(Number(cantidad))) {
      setItemError(`El ingrediente "${ingSeleccionadoObj.nombre}" se mide en unidades enteras, no acepta decimales.`);
      return;
    }

    const ingInfo = ingredientesDb.find(i => i.id === Number(selectedIngrediente));
    
    // Obtenemos nombre y abreviatura del catálogo cargado
    const uniNombre = ingInfo.unidades_medida?.nombre || '';
    const uniAbrev = ingInfo.unidades_medida?.abreviatura || '';

    setItemsCompra([...itemsCompra, {
      id: ingInfo.id,
      nombre: ingInfo.nombre,
      // Formateamos la cadena combinada
      unidad: uniNombre ? `${uniNombre} (${uniAbrev})` : uniAbrev,
      cantidad: Number(cantidad),
      precio_unitario: Number(precioUnitario)
    }]);
    
    setItemError(null);
    setLocalError(null);
    setSelectedIngrediente(''); setCantidad(''); setPrecioUnitario('');
  };

  // Función corregida para garantizar la eliminación de ítems por identificador.
  const eliminarItem = (id) => {
    if (isReadOnly) return;
    setItemsCompra(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!formData.proveedor_id || itemsCompra.length === 0) {
      setLocalError("Asegúrate de seleccionar un proveedor y añadir al menos un ítem.");
      return;
    }
    const payload = {
      ...formData,
      items: itemsCompra.map(item => ({
        ingrediente_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario
      }))
    };
    onSubmit(payload);
  };

  if (fetchingData && !initialData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700">
        <Loader2 className="h-10 w-10 text-biskoto animate-spin mb-4" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Preparando factura...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
      <AnimatePresence>
        {(localError || externalError) && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50 flex items-center p-4 text-red-700 dark:text-red-400 overflow-hidden">
            <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
            <span className="text-sm font-medium">{localError || externalError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {isReadOnly && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">
          <Eye size={14} /> Modo Vista de Lectura
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10">
        {/* ENCABEZADO: PROVEEDOR Y TOTAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
              <Truck size={18} className="text-biskoto" /> Proveedor Responsable
            </label>
            
            {isReadOnly ? (
              // MODO LECTURA: Input estático y limpio
              <div className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-gray-700 dark:text-white font-medium opacity-80 cursor-not-allowed">
                {initialData?.proveedores?.nombre || "Proveedor no disponible"}
              </div>
            ) : (
              // MODO EDICIÓN: SearchableSelect con z-30
              <div className="relative z-30">
                <SearchableSelect 
                  value={formData.proveedor_id}
                  onChange={(val) => setFormData(prev => ({ ...prev, proveedor_id: val }))}
                  placeholder="Buscar proveedor..."
                  options={proveedores.map(p => ({
                    value: p.id,
                    label: p.nombre
                  }))}
                />
              </div>
            )}
          </div>

          <div className="bg-biskoto/5 dark:bg-white/5 p-6 rounded-2xl border border-biskoto/20 dark:border-white/10 flex flex-col justify-center items-center text-center shadow-inner">
            <label className="text-[10px] font-black text-biskoto/60 dark:text-white/60 uppercase mb-1 tracking-tighter">Monto Total Bruto</label>
            <span className="text-2xl font-black text-biskoto dark:text-white font-mono">
              {new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(formData.monto_total)}
            </span>
          </div>
        </div>

        {/* SECCIÓN 1: ENTRADA DE INSUMOS (CARGA) */}
        {!isReadOnly && (
          <div className="pt-8 border-t border-gray-100 dark:border-slate-700">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
              <Plus className="text-biskoto" size={18} /> Entrada de Insumos
            </h3>

            {/* Mensaje de error local con soporte para modo oscuro y botón de cierre */}
            <AnimatePresence>
              {itemError && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl flex items-center justify-between text-red-700 dark:text-red-400 overflow-hidden shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle size={18} className="flex-shrink-0" />
                    <span className="text-xs font-bold tracking-tight">{itemError}</span>
                  </div>
                  
                  {/* Botón para cerrar el error manualmente */}
                  <button 
                    type="button"
                    onClick={() => setItemError(null)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-800/40 rounded-full transition-colors"
                    title="Cerrar aviso"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-12 gap-4 items-end shadow-sm">
              <div className="md:col-span-5 relative z-20">
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1 block">Ingrediente</label>
                <SearchableSelect 
                  value={selectedIngrediente}
                  onChange={(val) => setSelectedIngrediente(val)}
                  placeholder="Elegir insumo..."
                  
                  // CAMBIO PARA COMPRAS (Blanco y Pequeño)
                  bgClasses="bg-white dark:bg-slate-800"
                  pyClasses="py-2.5"
                  
                  options={ingredientesDb
                    .filter(ing => !ing.es_ilimitado) // <--- Solo mostramos los que requieren compra
                    .map(ing => ({
                      value: ing.id,
                      label: ing.nombre,
                      subLabel: ing.unidades_medida?.abreviatura || 'u'
                    }))
                  }
                />
              </div>
              <div className="md:col-span-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1 block">Cantidad</label>
                  <input type="number" placeholder="0.00" value={cantidad} step={requiereEnteros ? "1" : "0.01"} min="0" onChange={(e) => {setCantidad(e.target.value); if (itemError) setItemError(null); }}
                    className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-biskoto outline-none"
                  />
              </div>
              <div className="md:col-span-3">
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1.5 ml-1 block">Precio U.</label>
                <input type="number" placeholder="0.00" value={precioUnitario} onChange={(e) => setPrecioUnitario(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-biskoto outline-none"
                />
              </div>
              <div className="md:col-span-1">
                <button 
                  type="button" 
                  onClick={agregarItem} 
                  disabled={!canAdd}
                  className="w-full h-11 bg-biskoto text-white rounded-xl flex items-center justify-center hover:bg-biskoto-700 transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={22} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: DETALLE DE ÍTEMS (TABLA) */}
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-700">
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <ClipboardList size={16} /> Detalle de la Transacción
          </h3>
          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">Insumo</th>
                    <th className="px-6 py-4 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest">Cant.</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest hidden sm:table-cell">Unitario</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">Subtotal</th>
                    {!isReadOnly && <th className="px-6 py-4"></th>}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-100 dark:divide-slate-800">
                  {itemsCompra.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{item.nombre}</p>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">{item.unidad}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 rounded-lg text-xs font-mono text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700">
                          {item.cantidad}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                        {new Intl.NumberFormat('es-CR').format(item.precio_unitario)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-black text-biskoto dark:text-white font-mono">
                          {new Intl.NumberFormat('es-CR').format(item.cantidad * item.precio_unitario)}
                        </span>
                      </td>
                      {!isReadOnly && (
                        <td className="px-6 py-4 text-center">
                          <button 
                            type="button" 
                            onClick={() => eliminarItem(item.id)} 
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {itemsCompra.length === 0 && (
                    <tr>
                      <td colSpan={isReadOnly ? 4 : 5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 italic text-sm">No hay productos en esta factura.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* NOTAS Y ACCIONES FINALES */}
        <div className="pt-10 border-t border-gray-100 dark:border-slate-700 space-y-8">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
              <Info size={18} className="text-biskoto" /> Notas Adicionales
            </label>
            <textarea 
              disabled={isReadOnly}
              rows="3" value={formData.notas} 
              onChange={(e) => setFormData({...formData, notas: e.target.value})}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-biskoto dark:text-white disabled:opacity-70 transition-all resize-none shadow-inner" 
              placeholder={isReadOnly ? "Sin observaciones." : "Ej: Factura de contado para insumos de producción..."}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <Link to="/admin/compras" className="px-10 py-3.5 text-center text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all uppercase tracking-widest">
              {isReadOnly ? 'Regresar al Listado' : 'Cancelar'}
            </Link>
            {!isReadOnly && (
              <button 
                type="submit" 
                disabled={submitting} 
                className="bg-biskoto text-white px-12 py-3.5 rounded-xl font-black flex items-center justify-center gap-3 shadow-xl shadow-biskoto/20 hover:bg-biskoto-700 transition-all disabled:opacity-50 uppercase text-xs tracking-widest"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {buttonText}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompraForm;