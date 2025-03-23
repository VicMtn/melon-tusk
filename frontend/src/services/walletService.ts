import { CoinData } from '../types/crypto';
import { formatCurrency } from '../utils/formatters';
import { IWallet } from '../types/wallet';
import api from './api';


/**
 * Service to manage user's wallet data
 */
class WalletService {

  async getUserWallet(): Promise<IWallet> {
    try {

      const userData = localStorage.getItem('userData');
      if (!userData) {
        throw new Error('User data not found in localStorage');
      }
      const response = await api.get<{ data: IWallet }>('/wallet');

      if (response?.data) {
        return response.data as unknown as IWallet;
      }

      const { wallet } = JSON.parse(userData);
      if (!wallet) {
        throw new Error('Wallet not found in user data');
      }

      return wallet;
    } catch (error) {
      console.error('Error fetching user wallet:', error);
      throw error;
    }
  }

  /**
   * Calculates the total portfolio value and its 24h variation
   */
  calculateWalletValue(wallet: IWallet, marketData: CoinData[]): { totalValue: number, change24h: number } {
    if (!wallet?.assets?.length || !marketData?.length) {
      return { totalValue: 0, change24h: 1 };
    }

    let totalValue = 0;
    let totalValueYesterday = 0;

    wallet.assets.forEach(asset => {
      if (!asset.code || typeof asset.amount !== 'number') {
        console.warn('Invalid asset in wallet:', asset);
        return;
      }

      const coin = marketData.find(c => c.code === asset.code);

      if (coin?.rate) {
        const currentValue = asset.amount * coin.rate;
        totalValue += currentValue;

        const yesterdayRate = coin.delta?.day ? coin.rate / coin.delta.day : coin.rate;
        const yesterdayValue = asset.amount * yesterdayRate;
        totalValueYesterday += yesterdayValue;
      }
    });

    const change24h = totalValueYesterday > 0 
      ? totalValue / totalValueYesterday 
      : 1;

    return { totalValue, change24h };
  }

  /**
   * Formate the portfolio value for display
   */
  formatWalletValue(value: number): string {
    return formatCurrency(value);
  }
}

export default new WalletService(); 