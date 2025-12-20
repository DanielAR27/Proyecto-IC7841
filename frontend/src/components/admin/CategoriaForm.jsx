import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Save, AlertCircle } from 'lucide-react';

/**
 * Componente de Formulario Reutilizable para Categorías.
 * Maneja tanto la creación como la edición de categorías, gestionando el estado local
 * y la validación básica antes de enviar los datos al componente padre.
 */
const CategoriaForm = ({ 
  initialData, 
  onSubmit, 
  loading, 
  error, 
  buttonText = 'Guardar' 
}) => {
  // Define la estructura de datos predeterminada para el formulario
  const defaultValues = { nombre: '', descripcion: '' };

  // Inicializa el estado del formulario. Si initialData es nulo, utiliza los valores por defecto.
  const [formData, setFormData] = useState(initialData || defaultValues);

  // Sincroniza el estado local cuando las propiedades de initialData cambian (ej. al cargar datos de edición)
  useEffect(() => {
    setFormData(initialData || defaultValues);
  }, [initialData]);

  // Maneja la actualización de campos individuales del formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Gestiona el evento de envío, previniendo la recarga y delegando la lógica al padre
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Verifica la integridad de los datos antes de renderizar para evitar errores de renderizado
  if (!formData) return null; 

  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
      
      {/* Visualización de errores provenientes del backend o validaciones previas */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50 flex items-center text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Campo: Nombre de la Categoría */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre de la Categoría <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            required
            placeholder="Ej. Bebidas Calientes"
            value={formData.nombre} 
            onChange={handleChange}
            className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-biskoto focus:border-biskoto transition-colors"
          />
        </div>

        {/* Campo: Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción <span className="text-gray-400 font-normal">(Opcional)</span>
          </label>
          <textarea
            name="descripcion"
            id="descripcion"
            rows="3"
            placeholder="Breve descripción para mostrar en el catálogo..."
            value={formData.descripcion || ''}
            onChange={handleChange}
            className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-biskoto focus:border-biskoto resize-none transition-colors"
          />
        </div>

        {/* Botones de Acción (Cancelar / Guardar) */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <Link
            to="/admin/categorias"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-biskoto rounded-lg hover:bg-biskoto-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-biskoto disabled:bg-biskoto/50 transition-colors shadow-sm"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {buttonText}
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CategoriaForm;