import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { XCircle, X } from 'lucide-react';
import IconBackground from '../../components/IconBackground';

/**
 * Componente de la página de registro de usuarios.
 * Se implementa una disposición de campos que separa nombre y apellido, 
 * y permite el ingreso opcional de la dirección.
 */
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    direccion: ''
  });

  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [loadingLocal, setLoadingLocal] = useState(false);
  
  const { register, user, loading } = useAuth();
  const navigate = useNavigate();

  /**
   * Se verifica si existe una sesión activa para redirigir al home.
   */
  useEffect(() => {
    if (!loading && user) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  /**
   * Se gestiona el temporizador para el cierre automático de la alerta.
   */
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  /**
   * Se actualiza el estado local al escribir en cualquier campo del formulario.
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setShowAlert(false);

        // Validación de teléfono: exactamente 8 números
        const telefonoRegex = /^[0-9]{8}$/;
        if (!telefonoRegex.test(formData.telefono)) {
            setError('El teléfono debe tener exactamente 8 números');
            setShowAlert(true);
            return;
        }

        setLoadingLocal(true);
        try {
            await register(formData);
            // Se envía el mensaje de éxito mediante el estado de la ruta
            navigate('/login', { state: { successMsg: 'Se ha registrado exitosamente' } });
        } catch (err) {
            // Se intenta capturar el error específico del backend
            setError(err.error || 'Error en el servidor. Revisa los datos.');
            setShowAlert(true);
        } finally {
            setLoadingLocal(false);
        }
    };

  if (loading && !user) return null;

  return (
    <IconBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
        
        {/* Alerta de Error */}
        {showAlert && (
          <div className="max-w-md w-full mb-4 flex items-center justify-between bg-red-50 border-l-4 border-red-500 p-4 shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
            <button onClick={() => setShowAlert(false)} className="text-red-500 hover:text-red-800">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Contenedor del Formulario */}
        <div className="max-w-lg w-full space-y-6 p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Crear Cuenta</h2>
            <p className="mt-2 text-sm text-gray-500 font-light">
              Únete para gestionar tus pedidos de repostería
            </p>
          </div>
          
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Fila de Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nombre</label>
                <input
                  name="nombre"
                  type="text"
                  required
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Apellido</label>
                <input
                  name="apellido"
                  type="text"
                  required
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all"
                  value={formData.apellido}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Correo</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Teléfono</label>
                <input
                  name="telefono"
                  type="tel"
                  required
                  placeholder="88887777"
                  className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Contraseña</label>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Dirección Opcional */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Dirección <span className="text-gray-400 lowercase italic">(No obligatorio)</span>
              </label>
              <textarea
                name="direccion"
                rows="2"
                placeholder="Provincia, cantón y señas exactas..."
                className="appearance-none rounded-lg block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm transition-all"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loadingLocal}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md active:scale-[0.98] disabled:bg-blue-300"
              >
                {loadingLocal ? 'Registrando...' : 'Crear Cuenta'}
              </button>
            </div>
          </form>

          {/* Separador */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/0">
                <div className="h-1.5 w-1.5 rounded-full border border-gray-300 bg-white"></div>
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-4 hover:text-blue-800 transition-all">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </IconBackground>
  );
};

export default RegisterPage;