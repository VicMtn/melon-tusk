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
  /**
   * Get current Fear and Greed Index
   */
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

  /**
   * Generate mock current Fear and Greed Index data
   * Used when API is not available
   */
  getMockCurrentIndex(): FearAndGreedData {
    const value = Math.floor(Math.random() * 100);
    let classification: FearAndGreedData['classification'];
    
    if (value <= 20) classification = 'Extreme Fear';
    else if (value <= 40) classification = 'Fear';
    else if (value <= 60) classification = 'Neutral';
    else if (value <= 80) classification = 'Greed';
    else classification = 'Extreme Greed';
    
    return {
      value,
      classification,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate mock historical Fear and Greed Index data
   * Used when API is not available
   * @param days Number of days of historical data to generate
   */
  getMockHistoricalIndex(days: number = 30): FearAndGreedData[] {
    const mockData: FearAndGreedData[] = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const value = Math.floor(Math.random() * 100);
      let classification: FearAndGreedData['classification'];
      
      if (value <= 20) classification = 'Extreme Fear';
      else if (value <= 40) classification = 'Fear';
      else if (value <= 60) classification = 'Neutral';
      else if (value <= 80) classification = 'Greed';
      else classification = 'Extreme Greed';
      
      mockData.push({
        value,
        classification,
        timestamp: date.toISOString()
      });
    }
    
    // Sort by date (oldest to newest)
    return mockData.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }
}

// Export a singleton instance
export default new FearAndGreedService(); 