import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Save, AlertCircle, Truck, Mail, Phone, User, Store,
  AlertTriangle
} from 'lucide-react';

const ProveedorForm = ({
  initialData,
  onSubmit,
  loading,
  error: parentError,
  buttonText = 'Guardar Proveedor'
}) => {

  const defaultValues = {
    nombre: '',
    contacto_nombre: '',
    telefono: '',
    email: ''
  };

  const [formData, setFormData] = useState(initialData || defaultValues);
  const [validationError, setValidationError] = useState(null);

  // Unifica errores del padre (backend) con locales
  const displayError = parentError || validationError;

  // Auto-scroll al tope si hay error
  useEffect(() => {
    if (displayError) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [displayError]);

  // Cargar datos iniciales cuando llegan (Modo Edición)
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        contacto_nombre: initialData.contacto_nombre || '',
        telefono: initialData.telefono || '',
        email: initialData.email || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (validationError) setValidationError(null);

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    // Validación básica antes de enviar
    if (!formData.nombre.trim()) {
      setValidationError("El nombre de la empresa es obligatorio.");
      return;
    }

    // Chequeo de teléfono en frontend para no saturar el backend
    const telefonoRegex = /^[0-9]{8}$/;
      if (formData.telefono && !telefonoRegex.test(formData.telefono)) {
        setValidationError("El teléfono debe tener exactamente 8 números.");
        return;
    }

    onSubmit(formData);
  };

  const inputClasses =
    "w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-biskoto dark:text-white transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200 dark:disabled:bg-slate-800/50 dark:disabled:text-gray-400 disabled:cursor-not-allowed";

  // Identificamos si estamos en modo edición para mostrar advertencias
  const isEditing = !!initialData;

  return (
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-in fade-in duration-300">

      {/* Mensaje de Error */}
      {displayError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50 flex items-center text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium">{displayError}</span>
        </div>
      )}

      {/* Header del Formulario */}
      <div className="bg-gray-50 dark:bg-slate-900/50 px-8 py-6 border-b border-gray-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          {isEditing ? <Store className="text-biskoto" /> : <Truck className="text-biskoto" />}
          {isEditing ? `Editando: ${initialData.nombre}` : 'Registrar Nuevo Proveedor'}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {isEditing 
            ? 'Actualiza los datos de contacto. El historial de compras se mantendrá intacto.'
            : 'Completa la ficha para empezar a registrar compras a este proveedor.'}
        </p>
      </div>

      {/* Advertencia en Modo Edición */}
      {isEditing && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-blue-100 dark:border-blue-800 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">Información Importante</h4>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Si cambias el nombre de la empresa, se reflejará en todos los reportes futuros, pero las facturas pasadas mantendrán la integridad de sus montos.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 space-y-8">

        {/* GRUPO 1: IDENTIDAD DE LA EMPRESA */}
        <div>
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
            <Store size={16} className="text-gray-500" />
            Nombre de la Empresa <span className="text-red-500">*</span>
          </label>
          <input
            name="nombre"
            type="text"
            required
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Distribuidora Los Angeles S.A."
            className={inputClasses}
          />
          <p className="text-xs text-gray-500 mt-2 ml-1">
            Este es el nombre que aparecerá en los selectores de compra. Debe ser único.
          </p>
        </div>

        {/* GRUPO 2: DETALLES DE CONTACTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-slate-700">
          
          {/* Nombre del Contacto */}
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
              <User size={16} className="text-gray-500" />
              Persona de Contacto
            </label>
            <input
              name="contacto_nombre"
              type="text"
              value={formData.contacto_nombre}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez (Vendedor)"
              className={inputClasses}
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
              <Phone size={16} className="text-gray-500" />
              Teléfono / WhatsApp
            </label>
            <input
              name="telefono"
              type="text"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+506 8888-8888"
              className={inputClasses}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
              <Mail size={16} className="text-gray-500" />
              Correo Electrónico
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ventas@proveedor.com"
              className={inputClasses}
            />
          </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-slate-700">
          <Link 
            to="/admin/proveedores" 
            className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-biskoto text-white px-8 py-3 rounded-xl font-bold hover:bg-biskoto-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-biskoto/20 transition-all transform active:scale-95"
          >
            <Save size={20} />
            {loading ? 'Guardando...' : buttonText}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ProveedorForm;