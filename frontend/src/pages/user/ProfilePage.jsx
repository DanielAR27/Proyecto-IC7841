import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext'; // Importamos el contexto
import Navbar from '../../components/Navbar';
import { User, Mail, Phone, MapPin, Save, Shield, CheckCircle2, AlertCircle, Moon, Sun } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  
  // 1. Trae el tema REAL guardado y la función para actualizarlo
  const { theme: savedTheme, setTheme } = useTheme();

  // 2. Crear un estado LOCAL para la previsualización
  // Inicializa según si el tema guardado es 'dark'
  const [isDarkPreview, setIsDarkPreview] = useState(savedTheme === 'dark');

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    rol: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Sincronizar formulario con usuario
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        rol: user.rol || 'cliente'
      });
    }
  }, [user]);

  // --- LÓGICA DE PREVISUALIZACIÓN (PREVIEW) ---
  
  // Efecto: Cuando cambia el switch local, actualiza el DOM visualmente
  // PERO NO toca el contexto global todavía.
  useEffect(() => {
    if (isDarkPreview) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Cuando el usuario se vaya de esta página (desmonte el componente),
    // se fuerza a que la app vuelva al tema GUARDADO (savedTheme), ignorando el preview.
    return () => {
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
  }, [isDarkPreview, savedTheme]);

  // Toggle local (Solo visual)
  const handleTogglePreview = () => {
    setIsDarkPreview(prev => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message.text) setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const telefonoRegex = /^[0-9]{8}$/;
      if (!telefonoRegex.test(formData.telefono)) {
        throw new Error("El teléfono debe tener exactamente 8 números.");
      }

      // 1. Guardar Datos Personales
      await updateUserProfile(formData);

      // Al dar click en guardar, hace oficial el cambio en el contexto
      setTheme(isDarkPreview ? 'dark' : 'light');

      setMessage({ type: 'success', text: 'Datos y preferencias guardados correctamente.' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      const errorMsg = error.error || error.message || 'Ocurrió un error al guardar.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Mi Perfil</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Administra tu información personal y apariencia.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
          
          {message.text && (
            <div className={`p-4 flex items-center ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-b dark:border-green-900/50' 
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-b dark:border-red-900/50'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* SECCIÓN 1: Switch de Previsualización */}
              <div 
                onClick={handleTogglePreview} // Usa el toggle local
                className="bg-blue-50 dark:bg-slate-700/50 p-6 rounded-lg border border-blue-100 dark:border-slate-600 flex items-center justify-between transition-colors duration-300 cursor-pointer group select-none"
              >
                <div className="flex items-center">
                   <div className={`p-2 rounded-full mr-4 transition-colors ${isDarkPreview ? 'bg-indigo-500 text-white' : 'bg-yellow-400 text-white'}`}>
                     {isDarkPreview ? <Moon size={20} /> : <Sun size={20} />}
                   </div>
                   <div>
                     <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Modo Oscuro</h3>
                     <p className="text-xs text-gray-500 dark:text-gray-300">
                       {isDarkPreview ? 'Activado (Previsualización)' : 'Desactivado'}
                     </p>
                   </div>
                </div>

                <div
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    isDarkPreview ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isDarkPreview ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* ... RESTO DE SECCIONES (Cuenta, Datos, etc.) IGUAL QUE ANTES ... */}
              {/* Copia y pega las secciones de Cuenta, Datos Personales y Envío aquí */}
               <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-lg border border-gray-100 dark:border-slate-700 transition-colors">
                <h3 className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 font-bold mb-4 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Información de Cuenta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
                    <input type="email" disabled value={formData.email} className="w-full pl-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2 text-gray-500 dark:text-gray-400 cursor-not-allowed select-none" />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol</label>
                    <input type="text" disabled value={formData.rol} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg px-4 py-2 text-gray-500 dark:text-gray-400 cursor-not-allowed select-none" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Datos Personales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                    <input name="nombre" type="text" required value={formData.nombre} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellido</label>
                    <input name="apellido" type="text" required value={formData.apellido} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors" />
                  </div>
                </div>
              </div>

               <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Información de Envío
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono Móvil</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </div>
                      <input name="telefono" type="tel" required value={formData.telefono} onChange={handleChange} className="w-full pl-10 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección Exacta</label>
                    <textarea name="direccion" rows="3" value={formData.direccion} onChange={handleChange} className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none transition-colors" />
                  </div>
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="pt-6 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-all shadow-md active:scale-95 disabled:bg-blue-300 dark:disabled:bg-blue-900/50"
                >
                  {loading ? 'Guardando...' : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Guardar Todo
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;