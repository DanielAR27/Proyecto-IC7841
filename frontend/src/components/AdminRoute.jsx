import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * Guardia de ruta para acceso administrativo.
 * Valida la existencia de una sesión activa y el rol de administrador 
 * antes de permitir el acceso a las subrutas.
 */
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Se detiene el renderizado mientras se verifica la persistencia de la sesión en el contexto
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <Loader2 className="h-10 w-10 text-biskoto animate-spin" />
      </div>
    );
  }

  // Redirige al inicio si no existe usuario o si el rol no corresponde a administrador
  if (!user || user.rol !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  // Renderiza los componentes hijos o el Outlet para rutas anidadas
  return children ? children : <Outlet />;
};

export default AdminRoute;