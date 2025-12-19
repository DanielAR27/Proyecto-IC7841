import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/home/HomePage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import UpdatePasswordPage from './pages/auth/UpdatePasswordPage';
import ProfilePage from './pages/user/ProfilePage';
import CategoriasPage from './pages/admin/CategoriasPage';
import CrearCategoriaPage from './pages/admin/CrearCategoriaPage';
import EditarCategoriaPage from './pages/admin/EditarCategoriaPage';

/**
 * Componente para proteger rutas privadas.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/home" /> : <LoginPage />} 
        />

        <Route 
          path="/registro" 
          element={user ? <Navigate to="/home" /> : <RegisterPage/>} 
        />
        
        <Route
          path="/recuperar-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/actualizar-password"
          element={<UpdatePasswordPage />} 
        />

        {/* Rutas Privadas */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />

        {/* Rutas de Administración */}
        <Route 
          path="/admin/categorias" 
          element={
            <ProtectedRoute>
              <CategoriasPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/categorias/nueva" 
          element={
            <ProtectedRoute>
              <CrearCategoriaPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/categorias/editar/:id" 
          element={
            <ProtectedRoute>
              <EditarCategoriaPage />
            </ProtectedRoute>
          } 
        />

        {/* Redirecciones */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;