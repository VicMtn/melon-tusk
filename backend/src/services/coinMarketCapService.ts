import { IFearAndGreed } from '../interfaces/IfearAndGreed';
import createAxiosInstance from './index';
import config from '../config/envConfig';

const cmcApi = createAxiosInstance({
  baseURL: 'https://pro-api.coinmarketcap.com',
  apiKeys: {
    'X-CMC_PRO_API_KEY': config.cmc_api_key
  }
});

export const getFearAndGreedIndex = async (): Promise<IFearAndGreed> => {
  try {
    const response = await cmcApi.get('/v3/fear-and-greed/latest');
    return response.data;
  } catch (error) {
    console.error('Error fetching fear and greed index:', error);
    throw error;
  }
};
