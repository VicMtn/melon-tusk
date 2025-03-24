export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit' | 'withdraw';
  code?: string;
  amount: number;
  rate?: number;
  total: number;
  currency: string;
  createdAt?: string;
  png64?: string;
  name?: string;
}

export interface TransactionResponse {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
} 