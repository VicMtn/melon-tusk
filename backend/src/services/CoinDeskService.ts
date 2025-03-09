import axios from 'axios';
import { NewsArticle } from '../models/NewsArticle.js';

export class CoinDeskService {
  private baseUrl: string;
  private params: Record<string, string | number>;

  constructor() {
    this.baseUrl = 'https://data-api.coindesk.com/news/v1/article/list';
    this.params = {
      lang: 'EN',
      limit: 10,
    };
  }

  async fetchNewsArticles(): Promise<NewsArticle[]> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: this.params,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      return response.data.Data;
    } catch (error) {
      console.error('Error fetching news articles:', error);
      throw error;
    }
  }
}