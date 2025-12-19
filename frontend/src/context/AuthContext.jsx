import { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../api/authService';
import * as profileService from '../api/profileService';

// Se crea el contexto de autenticación
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Al cargar la aplicación, verificamos token y cargamos perfil
   */
  useEffect(() => {
    const cargarUsuario = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const perfil = await profileService.getMiPerfil();
          setUser(perfil);
        } catch (error) {
          console.error("Error al cargar sesión persistente:", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    cargarUsuario();
  }, []);

  /**
   * Login: Obtiene token y luego descarga el perfil completo
   */
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      
      const perfil = await profileService.getMiPerfil();
      setUser(perfil);
      return perfil;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.registrar(userData);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateUserProfile = async (datos) => {
    try {
      const response = await profileService.actualizarPerfil(datos);
      
      const perfilActualizado = response.perfil || response; 
      
      setUser(prev => ({ ...prev, ...perfilActualizado }));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const resetPasswordRequest = async (email) => {
    try {
      await authService.recuperarPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const updatePassword = async (newPassword) => {
      try {
        const data = await authService.updatePassword(newPassword);
        return data;
      } catch (error) {
        throw error;
      }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      updateUserProfile,
      logout, 
      resetPasswordRequest,
      updatePassword,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};