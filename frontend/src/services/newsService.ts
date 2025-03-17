import api from './api.ts';

export interface NewsArticle {
  articleId: number;
  title: string;
  url: string;
  imageUrl: string;
  body: string;
  publishedOn: string;
  source: {
    name: string;
    url: string;
    imageUrl: string;
  };
  sentiment: string;
  categories: string[];
}

export interface NewsResponse {
  data: NewsArticle[];
  meta: {
    count: number;
    lastUpdate: string;
  };
}

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