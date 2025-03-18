import api from './api.ts';

// Types pour les données utilisateur
export interface User {
  id: string;
  username: string;
  email: string;
  wallet?: {
    balance: number;
    assets: Array<{
      code: string;
      amount: number;
    }>;
  };
}

// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Service de gestion des utilisateurs et de l'authentification
 */
class UserService {
  private token: string | null = null;
  private currentUser: User | null = null;

  constructor() {
    // Récupérer le token stocké au démarrage
    this.token = localStorage.getItem('token');
    if (this.token) {
      // Configurer le token dans les headers par défaut
      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
  }


  /**
   * Connecter un utilisateur
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      this.setAuthData(response.data);
      return response.data.user;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error('An error occurred during login');
    }
  }

  /**
   * Inscrire un nouvel utilisateur
   */
  async register(data: RegisterData): Promise<User> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      this.setAuthData(response.data);
      return response.data.user;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Déconnecter l'utilisateur
   */
  logout(): void {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }


  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  async getCurrentUser(): Promise<User> {
    if (!this.isAuthenticated() && !localStorage.getItem('userId')) {
      throw new Error('User not authenticated');
    }
    
    try {
      const response = await api.get<User>('/auth/me');
      this.currentUser = response.data;
      return this.currentUser;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.logout();
        throw new Error('Session expired');
      }
      
      throw error;
    }
  }

  /**
   * Mettre à jour le profil de l'utilisateur
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    const response = await api.put<User>('/users/me', data);
    this.currentUser = response.data;
    return this.currentUser;
  }

  /**
   * Mettre à jour le mot de passe
   */
  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    await api.put('/users/me/password', {
      currentPassword,
      newPassword
    });
  }


  /**
   * Vérifier si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Obtenir le token actuel
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Définir les données d'authentification
   */
  private setAuthData(authData: AuthResponse): void {
    this.token = authData.token;
    this.currentUser = authData.user;
    localStorage.setItem('token', authData.token);
    localStorage.setItem('userId', authData.user.id);
    api.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
  }
}

export default new UserService(); 