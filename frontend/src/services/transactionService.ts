import api from './api.ts';

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdraw';
  code?: string;
  amount: number;
  rate?: number;
  total: number;
  currency: string;
  date: string;
}

export interface TransactionResponse {
  message: string;
  transaction: Transaction;
  newBalance: number;
}

class TransactionService {
  /**
   * Acheter une cryptomonnaie
   */
  async buyCrypto(code: string, amount: number): Promise<TransactionResponse> {
    try {
      const response = await api.post<TransactionResponse>('/transactions/buy', {
        code,
        amount
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Gérer les opérations sur le wallet (dépôt/retrait)
   */
  async handleWalletOperation(type: 'deposit' | 'withdraw', amount: number): Promise<TransactionResponse> {
    try {
      const response = await api.post<TransactionResponse>('/transactions/wallet', {
        type,
        amount
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }

  /**
   * Récupérer l'historique des transactions
   */
  async getHistory(params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    type?: 'buy' | 'sell' | 'deposit' | 'withdraw';
  }) {
    try {
      const response = await api.get('/transactions/history', { params });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw error;
    }
  }
}

export default new TransactionService(); 