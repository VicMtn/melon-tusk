import api from './api.ts';
import { LoginCredentials, RegisterData, AuthResponse } from '../types/user.ts';
import { User } from '../types/user.ts';
import { AxiosError } from 'axios';

class UserService {
  private token: string | null = null;
  private currentUser: User | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
    if (this.token) {
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
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      if (error instanceof AxiosError && error.response?.status === 401) {
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
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data?.error) {
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
    localStorage.removeItem('userId');
    localStorage.removeItem('userData');
    delete api.defaults.headers.common['Authorization'];
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
    localStorage.setItem('userData', JSON.stringify(response.data));
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
    localStorage.setItem('userData', JSON.stringify(authData.user));
    api.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
  }
}

export default new UserService(); 