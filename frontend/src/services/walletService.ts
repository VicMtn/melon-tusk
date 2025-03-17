import api from './api';
import { MarketData } from '../types/crypto';
import { formatCurrency } from '../utils/formatters';

export interface WalletAsset {
  coinId: string;
  amount: number;
}

export interface WalletData {
  _id: string;
  userId: string;
  balance: number;
  assets: WalletAsset[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Service pour gérer les données du portefeuille de l'utilisateur
 */
class WalletService {
  /**
   * Récupère le portefeuille de l'utilisateur connecté depuis MongoDB
   */
  async getUserWallet(): Promise<WalletData> {
    try {
      const response = await api.get<{ data: WalletData }>('/wallet');
      
      if (response?.data?.data) {
        return response.data.data;
      }
      
      return this.getEmptyWallet();
    } catch (error) {
      console.error('Error fetching user wallet:', error);
      return this.getEmptyWallet();
    }
  }

  /**
   * Crée un portefeuille vide
   */
  private getEmptyWallet(): WalletData {
    return {
      _id: '',
      userId: '',
      balance: 0,
      assets: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Calcule la valeur totale du portefeuille et sa variation sur 24h
   */
  calculateWalletValue(wallet: WalletData, marketData: MarketData[]): { totalValue: number, change24h: number } {
    if (!wallet?.assets?.length || !marketData?.length) {
      return { totalValue: 0, change24h: 1 };
    }

    let totalValue = 0;
    let totalValueYesterday = 0;

    wallet.assets.forEach(asset => {
      if (!asset.coinId || typeof asset.amount !== 'number') {
        console.warn('Invalid asset in wallet:', asset);
        return;
      }

      const coin = marketData.find(c => c.code === asset.coinId);

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
   * Formate la valeur du portefeuille pour l'affichage
   */
  formatWalletValue(value: number): string {
    return formatCurrency(value);
  }
}

export default new WalletService(); 