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

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.token = null;
      this.currentUser = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userData');
      delete api.defaults.headers.common['Authorization'];
    }
  }


  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    await api.put('/users/me/password', {
      currentPassword,
      newPassword
    });
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
  getToken(): string | null {
    return this.token;
  }

  private setAuthData(authData: AuthResponse): void {
    this.token = authData.token;
    this.currentUser = authData.user;
    localStorage.setItem('token', authData.token);
    localStorage.setItem('userId', authData.user.id);
    localStorage.setItem('userData', JSON.stringify(authData.user));
    api.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
  }

  async getCurrentUser(): Promise<User | null> {
    const route = "/user";
    const response = await api.get<User>(route);
    this.currentUser = response.data;
    return this.currentUser;
  }
}

export default new UserService(); 