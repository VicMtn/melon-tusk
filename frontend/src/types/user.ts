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