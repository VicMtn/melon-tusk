import api from './api';

export interface FearAndGreedData {
  value: number;
  classification: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  timestamp: string;
}

export interface FearAndGreedHistoryData {
  data: FearAndGreedData[];
  meta: {
    lastUpdate: string;
  };
}

/**
 * Service for handling Fear and Greed Index data
 */
class FearAndGreedService {
  async getCurrentIndex(): Promise<FearAndGreedData> {
    try {
      const response = await api.get<{ data: FearAndGreedData }>('/market/fear-and-greed');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching Fear and Greed Index:', error);
      throw error;
    }
  }

  /**
   * Get historical Fear and Greed Index data
   * @param days Number of days of historical data to retrieve
   */
  async getHistoricalIndex(days: number = 30): Promise<FearAndGreedData[]> {
    try {
      const response = await api.get<{ data: FearAndGreedData[] }>(`/market/fear-greed/history?days=${days}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching historical Fear and Greed Index:', error);
      throw error;
    }
  }
}


export default new FearAndGreedService(); 