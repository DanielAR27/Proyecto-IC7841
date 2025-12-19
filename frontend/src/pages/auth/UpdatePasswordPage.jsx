import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle} from 'lucide-react';
import IconBackground from '../../components/IconBackground';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  /**
   * Al cargar, busca el token en la URL (hash).
   * El link de correo viene como: /actualizar-password#access_token=...&refresh_token=...
   */
  useEffect(() => {
    const hash = window.location.hash;
    // Extrae el access_token del hash
    const params = new URLSearchParams(hash.replace('#', '?'));
    const token = params.get('access_token');

    if (token) {
      // Guarda el token temporalmente para que las peticiones al backend funcionen
      localStorage.setItem('token', token);
    } else {
      // Si no hay token, el usuario llegó aquí por error o el link expiró
      setError('Enlace inválido o expirado. Vuelve a solicitar el correo.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }
    if (password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres');
    }

    setLoading(true);
    setError('');

    try {
      // Al llamar a esto, axios usará el token que se acaba de guardar en localStorage
      await updatePassword(password);
      
      // Se limpia el token del hash y del storage para obligarlo a loguearse bien
      localStorage.removeItem('token');
      navigate('/login', { state: { successMsg: 'Contraseña actualizada. Inicia sesión.' } });
    } catch (err) {
      setError('No se pudo actualizar la contraseña. El enlace puede haber expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IconBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Nueva Contraseña</h2>
          
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nueva contraseña</label>
              <input
                type="password"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Confirmar contraseña</label>
              <input
                type="password"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !!error} // Deshabilitar si hay error de token
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md disabled:bg-blue-300"
            >
              {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </IconBackground>
  );
};

export default UpdatePasswordPage;