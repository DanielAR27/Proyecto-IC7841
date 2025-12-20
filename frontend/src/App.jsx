import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';

// Páginas de Autenticación
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import UpdatePasswordPage from './pages/auth/UpdatePasswordPage';

// Páginas de Usuario y General
import HomePage from './pages/home/HomePage';
import ProfilePage from './pages/user/ProfilePage';

// Páginas de Administración
import CategoriasPage from './pages/admin/categorias/CategoriasPage';
import CrearCategoriaPage from './pages/admin/categorias/CrearCategoriaPage';
import EditarCategoriaPage from './pages/admin/categorias/EditarCategoriaPage';
import ProductosPage from './pages/admin/productos/ProductosPage';
import CrearProductoPage from './pages/admin/productos/CrearProductoPage';
import EditarProductoPage from './pages/admin/productos/EditarProductoPage';

/**
 * Componente para la protección de rutas privadas generales.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-biskoto"></div>
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-biskoto"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={user ? <Navigate to="/home" /> : <LoginPage />} />
        <Route path="/registro" element={user ? <Navigate to="/home" /> : <RegisterPage/>} />
        <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
        <Route path="/actualizar-password" element={<UpdatePasswordPage />} />

        {/* Rutas Privadas de Usuario */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Rutas de Administración Protegidas por AdminRoute */}
        <Route element={<AdminRoute />}>
            <Route path="/admin/categorias" element={<CategoriasPage />} />
            <Route path="/admin/categorias/nueva" element={<CrearCategoriaPage />} />
            <Route path="/admin/categorias/editar/:id" element={<EditarCategoriaPage />} />
            <Route path="/admin/productos" element={<ProductosPage />} />
            <Route path="/admin/productos/nuevo" element={<CrearProductoPage />} />
            <Route path="/admin/productos/editar/:id" element={<EditarProductoPage />} />
        </Route>

        {/* Gestión de redirecciones predeterminadas */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

export default App;