import api from './api';
import { CoinData } from '../types/crypto';

interface NewsArticle {
  title: string;
  url: string;
  description: string;
  publishedAt: string;
  source: string;
  imageUrl?: string;
}

export interface MarketResponse {
  data: CoinData[];
  meta: {
    lastUpdate: string;
    count: number;
  };
}

class MarketService {
  constructor() {
  }
  async getAllMarket(): Promise<CoinData[]> {
    try {
      const response = await api.get<CoinData[]>('/market/coins');
      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      return [];
    }
  }

  async getNews(): Promise<NewsArticle[]> {
    const response = await api.get<{ data: NewsArticle[] }>('/market/news');
    return response.data.data;
  }
}

export default new MarketService();