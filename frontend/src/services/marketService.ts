import api from './api';
import { CryptoMiddleware } from '../middleware/cryptoMiddleware';
import { MarketData } from '../types/crypto';

interface NewsArticle {
  title: string;
  url: string;
  description: string;
  publishedAt: string;
  source: string;
  imageUrl?: string;
}

export interface MarketResponse {
  data: MarketData[];
  meta: {
    lastUpdate: string;
    count: number;
  };
}

/**
 * Market Service for handling market data and news
 */
class MarketService {
  constructor() {
  }

  /**
   * Get market data for all cryptocurrencies
   */
  async getAllMarket(): Promise<MarketData[]> {
    try {
      const response = await api.get<MarketData[]>('/market/coins-top50');
      return CryptoMiddleware.transformCoins(response.data);
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

// Export a singleton instance
export default new MarketService();