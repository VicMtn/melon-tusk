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
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
} 