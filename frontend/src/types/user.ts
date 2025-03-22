import { IWallet } from "./wallet";

export interface User {
  id: string;
  username: string;
  email: string;
  walletId: string;
  wallet?: IWallet;
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
