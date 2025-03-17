import createAxiosInstance from './index';
import config from '../config/envConfig';
import { IArticlesResponse } from '../interfaces/IArticles';

const coindeskApi = createAxiosInstance({
  baseURL: 'https://data-api.coindesk.com',
  apiKeys: {
    'x-api-key': config.coindesk_api_key
  }
});

export const getLatestArticles = async (): Promise<IArticlesResponse> => {
  try {
    const response = await coindeskApi.get('/news/v1/article/list', {
        params: {
            lang: 'en',
            limit: 4,
        }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};