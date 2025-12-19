import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { XCircle, X, CheckCircle2 } from 'lucide-react';
import IconBackground from '../../components/IconBackground';

/**
 * Componente de la página de inicio de sesión.
 * Gestiona la autenticación, mensajes de error y notificaciones de éxito tras el registro.
 */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  
  // Estados para manejar el mensaje de éxito (ej: "Registro exitoso")
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.successMsg || '');
  const [showSuccess, setShowSuccess] = useState(!!location.state?.successMsg);

  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  /**
   * Se verifica si el usuario ya tiene sesión activa para redirigir al home.
   */
  useEffect(() => {
    if (!loading && user) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  /**
   * Gestión del mensaje de éxito (Banner Verde).
   * Se muestra por 5 segundos y se limpia el historial para evitar que aparezca al refrescar.
   */
  useEffect(() => {
    if (showSuccess) {
      // Se limpia el estado de la navegación para que el mensaje no persista en un refresh
      window.history.replaceState({}, document.title);
      
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  /**
   * Gestión del mensaje de error (Banner Rojo).
   * Se oculta automáticamente tras 5 segundos.
   */
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  /**
   * Procesa el envío del formulario de inicio de sesión.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowAlert(false);
    setShowSuccess(false); // Oculta el mensaje verde si el usuario intenta loguearse
    
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError(err.error || 'Correo o contraseña incorrectos');
      setShowAlert(true);
    }
  };

  if (loading && !user) return null;

  return (
    <IconBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        
        {/* Banner Verde: Mensaje de Éxito (ej. Registro completado) */}
        {showSuccess && (
          <div className="max-w-md w-full mb-4 flex items-center justify-between bg-green-50 border-l-4 border-green-500 p-4 shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
              <p className="text-sm text-green-700 font-medium">{successMessage}</p>
            </div>
            <button 
              onClick={() => setShowSuccess(false)}
              className="text-green-500 hover:text-green-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Banner Rojo: Mensaje de Error (ej. Credenciales inválidas) */}
        {showAlert && (
          <div className="max-w-md w-full mb-4 flex items-center justify-between bg-red-50 border-l-4 border-red-500 p-4 shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
            <button 
              onClick={() => setShowAlert(false)}
              className="text-red-500 hover:text-red-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Tarjeta del Formulario de Login */}
        <div className="max-w-md w-full space-y-6 p-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bienvenido</h2>
            <p className="mt-2 text-sm text-gray-500 font-light">
              Ingrese sus credenciales para acceder al sistema
            </p>
          </div>
          
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm transition-all"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md active:scale-[0.98]"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>

          {/* Enlace de recuperación */}
          <div className="text-center mt-4">
            <Link
              to="/recuperar-password"
              className="text-sm font-medium text-gray-400 hover:text-blue-600 transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Separador visual */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white/0">
                <div className="h-1.5 w-1.5 rounded-full border border-gray-300 bg-white"></div>
              </span>
            </div>
          </div>

          {/* Enlace de registro */}
          <div className="text-center pb-2">
            <p className="text-sm text-gray-600">
              ¿Todavía no tienes cuenta?{' '}
              <Link
                to="/registro"
                className="font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-4 hover:text-blue-800 hover:decoration-blue-800 transition-all duration-200"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </IconBackground>
  );
};

export default LoginPage;