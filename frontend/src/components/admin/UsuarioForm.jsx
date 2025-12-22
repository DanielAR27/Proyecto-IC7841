import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Save, AlertCircle, User, Shield, Mail, Phone, MapPin,
  AlertTriangle, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UsuarioForm = ({
  initialData,
  onSubmit,
  loading,
  error: parentError,
  buttonText = 'Guardar Usuario'
}) => {

  const defaultValues = {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    rol: 'cliente',
    activo: true
  };

  const [formData, setFormData] = useState(initialData || defaultValues);
  const [validationError, setValidationError] = useState(null);

  const { user: authUser, loading: authLoading } = useAuth();

  const displayError = parentError || validationError;

  // Scroll si hay error
  useEffect(() => {
    if (displayError) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [displayError]);

  // Cargar datos iniciales cuando llega initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        apellido: initialData.apellido || '',
        email: initialData.email || '',
        telefono: initialData.telefono || '',
        direccion: initialData.direccion || '',
        rol: initialData.rol || 'cliente',
        activo: initialData.activo !== undefined ? initialData.activo : true
      });
    }
  }, [initialData]);

  // Helper: agarrar IDs aunque vengan con nombres distintos
  const getPossibleId = (obj) => {
    if (!obj) return null;
    return obj.id ?? obj.userId ?? obj.authId ?? obj._id ?? null;
  };

  const currentUserId = useMemo(() => getPossibleId(authUser), [authUser]);
  const targetUserId = useMemo(() => getPossibleId(initialData), [initialData]);

  // ¿Me estoy editando a mí mismo?
  const isSelf = useMemo(() => {
    if (authLoading) return false;
    if (!currentUserId || !targetUserId) return false;
    return String(currentUserId) === String(targetUserId);
  }, [authLoading, currentUserId, targetUserId]);

  // Regla pedida: si el usuario editado ES admin, no se cambia rol.
  // (se bloquea el select y también se valida en submit)
  const isTargetAdmin = useMemo(() => {
    return String(initialData?.rol || formData?.rol || '').toLowerCase() === 'admin';
  }, [initialData?.rol, formData?.rol]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (validationError) setValidationError(null);

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);

    // 1) Bloqueo: si el usuario editado es admin, no se permite cambiar rol
    if (isTargetAdmin && String(formData.rol).toLowerCase() !== 'admin') {
      setValidationError("Acción bloqueada: No se puede cambiar el rol de un Administrador.");
      return;
    }

    // 2) Bloqueo: si me edito a mí mismo, no puedo quitarme admin ni desactivarme
    if (isSelf) {
      if (String(formData.rol).toLowerCase() !== 'admin') {
        setValidationError("Acción bloqueada: No puedes quitarte el rol de Administrador a ti mismo.");
        return;
      }
      if (formData.activo === false) {
        setValidationError("Acción bloqueada: No puedes desactivar tu propia cuenta.");
        return;
      }
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

  // Loader mientras AuthContext aún carga (así no calculamos isSelf con nulls)
  if (authLoading) {
    return (
      <div className="p-12 flex justify-center text-gray-500 dark:text-gray-400">
        Verificando permisos de edición...
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden animate-in fade-in duration-300">

      {/* Mensaje de Error */}
      {displayError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50 flex items-center text-red-700 dark:text-red-400">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium">{displayError}</span>
        </div>
      )}

      {/* Alerta si es Auto-Edición */}
      {isSelf && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-blue-100 dark:border-blue-800 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300">Estás editando tu propio perfil</h4>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Por seguridad, el Rol y el Estado de la cuenta están bloqueados.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 space-y-8">

        {/* GRUPO 1: DATOS PERSONALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Email */}
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
              <Mail size={16} className="text-gray-700 dark:text-gray-300 shrink-0" />
              Correo Electrónico
            </label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isSelf}
              className={inputClasses}
            />
            {!isSelf && (
              <p className="text-xs text-gray-500 mt-1">
                Nota: Cambiar el correo actualizará las credenciales de acceso.
              </p>
            )}
          </div>

          {/* Nombre */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
              Nombre
            </label>
            <input
              name="nombre"
              type="text"
              required
              value={formData.nombre}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
              Apellido
            </label>
            <input
              name="apellido"
              type="text"
              required
              value={formData.apellido}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          {/* ROL DE USUARIO */}
          <div className={`md:col-span-2 p-4 rounded-xl border transition-colors ${
            (isSelf || isTargetAdmin)
              ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800'
              : 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/50'
          }`}>
            <label className={`text-sm font-bold flex items-center gap-2 mb-2 ${
              (isSelf || isTargetAdmin) ? 'text-blue-800 dark:text-blue-400' : 'text-yellow-800 dark:text-yellow-500'
            }`}>
              <Shield size={16} />
              Rol de Usuario
            </label>

            <div className="relative">
              {(isSelf || isTargetAdmin) ? (
                // SOLO LECTURA: si es self o si el usuario editado es admin
                <div className="w-full bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 rounded-lg px-4 py-3 flex items-center justify-between cursor-not-allowed shadow-sm">
                  <span className="font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider text-sm">
                    Administrador
                  </span>
                  <Shield size={16} className="text-blue-500" />
                </div>
              ) : (
                <>
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    className="w-full bg-white dark:bg-slate-800 border border-yellow-300 dark:border-yellow-700 rounded-lg px-4 py-3 appearance-none outline-none font-medium pr-10 transition-all focus:ring-2 focus:ring-yellow-500 dark:text-white cursor-pointer"
                  >
                    <option value="cliente">Cliente (Usuario normal)</option>
                    <option value="admin">Administrador (Acceso total)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-yellow-600">
                    <ChevronDown size={20} />
                  </div>
                </>
              )}
            </div>

            {(!isSelf && !isTargetAdmin) && (
              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-2">
                Dar rol de Administrador otorga control total sobre el sistema.
              </p>
            )}

            {isTargetAdmin && !isSelf && (
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                Este usuario ya es Administrador. Por seguridad, no se permite cambiar su rol.
              </p>
            )}
          </div>

          {/* ESTADO DE LA CUENTA */}
          {initialData && (
            <div className={`md:col-span-2 flex items-center justify-between p-4 rounded-xl border ${
              isSelf
                ? 'bg-gray-50 border-gray-200 dark:bg-slate-800/50 dark:border-slate-700 opacity-70'
                : 'bg-gray-50 border-gray-200 dark:bg-slate-900/50 dark:border-slate-700'
            }`}>
              <div>
                <span className={`block text-sm font-bold ${isSelf ? 'text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                  Estado de la Cuenta
                </span>
                <span className="text-xs text-gray-500">
                  {isSelf
                    ? "No puedes desactivar tu propia cuenta."
                    : "Si se desactiva, el usuario perderá el acceso inmediatamente."}
                </span>
              </div>

              <label className={`relative inline-flex items-center ${isSelf ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleChange}
                  disabled={isSelf}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-biskoto/20 peer-checked:bg-biskoto dark:bg-slate-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 disabled:opacity-50"></div>
              </label>
            </div>
          )}
        </div>

        {/* GRUPO 2: CONTACTO */}
        <div className="pt-6 border-t border-gray-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
              <Phone size={16} /> Teléfono
            </label>
            <input
              name="telefono"
              type="text"
              required
              value={formData.telefono}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
              <MapPin size={16} /> Dirección
            </label>
            <input
              name="direccion"
              type="text"
              value={formData.direccion}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100 dark:border-slate-700">
          <Link to="/admin/usuarios" className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
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

export default UsuarioForm;
