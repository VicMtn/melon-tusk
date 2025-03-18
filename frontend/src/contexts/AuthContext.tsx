import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import userService from '../services/userService';
import { User, LoginCredentials, RegisterData } from '../types/user';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = userService.isAuthenticated();
      
      if (isAuth) {
        const userDataStr = localStorage.getItem('userData');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setUser(userData);
          
          // Rediriger vers la page d'accueil si l'utilisateur est déjà connecté
          if (window.location.pathname === '/') {
            navigate('/homepage');
          }
        } else {
          userService.logout();
          setUser(null);
          if (window.location.pathname !== '/') {
            navigate('/');
          }
        }
      } else {
        // Rediriger vers la page de login si l'utilisateur n'est pas connecté
        if (window.location.pathname !== '/') {
          navigate('/');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const login = async (credentials: LoginCredentials) => {
    const userData = await userService.login(credentials);
    setUser(userData);
    navigate('/homepage');
  };

  const register = async (data: RegisterData) => {
    const userData = await userService.register(data);
    setUser(userData);
    navigate('/homepage');
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    navigate('/');
  };

  const updateProfile = async (data: Partial<User>) => {
    const updatedUser = await userService.updateProfile(data);
    setUser(updatedUser);
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    await userService.updatePassword(currentPassword, newPassword);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
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