import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import userService from '../services/userService';
import { User, LoginCredentials, RegisterData } from '../types/user';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const clearError = () => setError(null);

  const handleSessionExpired = useCallback(() => {
    setUser(null);
    setError('Votre session a expiré. Veuillez vous reconnecter.');
    localStorage.removeItem('userData');
    userService.logout();
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = userService.isAuthenticated();
        
        if (isAuth) {
          const userDataStr = localStorage.getItem('userData');
          if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            
            // Vérifier la validité du token avec le backend
            try {
              const response = await fetch('/api/auth/verify', {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
              });
              
              if (!response.ok) {
                handleSessionExpired();
                return;
              }
              
              setUser(userData);
              if (window.location.pathname === '/') {
                navigate('/homepage');
              }
            } catch (error) {
              handleSessionExpired();
            }
          } else {
            handleSessionExpired();
          }
        } else {
          if (window.location.pathname !== '/') {
            navigate('/');
          }
        }
      } catch (error) {
        handleSessionExpired();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, handleSessionExpired]);

  const login = async (credentials: LoginCredentials) => {
    try {
      clearError();
      const userData = await userService.login(credentials);
      setUser(userData);
      navigate('/homepage');
    } catch (error) {
      setError('Erreur lors de la connexion');
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      clearError();
      const userData = await userService.register(data);
      setUser(userData);
      navigate('/homepage');
    } catch (error) {
      setError('Erreur lors de l\'inscription');
      throw error;
    }
  };

  const logout = async () => {
    try {
      clearError();
      await userService.logout();
      setUser(null);
      navigate('/');
    } catch (error) {
      setError('Erreur lors de la déconnexion');
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      clearError();
      await userService.updatePassword(currentPassword, newPassword);
    } catch (error) {
      setError('Erreur lors de la mise à jour du mot de passe');
      throw error;
    }
  };

  const refreshUser = useCallback(() => {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse user data from localStorage', error);
      }
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    updatePassword,
    clearError,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 