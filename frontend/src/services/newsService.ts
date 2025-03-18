import api from './api.ts';
import { NewsArticle, NewsResponse } from '../types/articles.ts';

class NewsService {
  async getLatestNews(): Promise<NewsResponse> {
    try {
      const response = await api.get<NewsResponse>('/market/articles');
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 
          'data' in error.response && error.response.data && 
          typeof error.response.data === 'object' && 'error' in error.response.data) {
        throw new Error(String(error.response.data.error));
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  }
}

export default new NewsService(); 