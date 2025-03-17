import { MarketData } from '../services/marketService';
import { cleanCryptoCode } from '../utils/formatters';

/**
 * Middleware pour transformer les données de crypto-monnaies
 */
export class CryptoMiddleware {
  /**
   * Transforme les données d'une crypto-monnaie
   * @param coin Les données brutes de la crypto-monnaie
   * @returns Les données transformées
   */
  static transformCoin(coin: MarketData): MarketData {
    return {
      ...coin,
      // Nettoyer le code en retirant les underscores
      code: cleanCryptoCode(coin.code || coin.symbol),
      // S'assurer que toutes les propriétés requises existent
      symbol: coin.symbol || '',
      name: coin.name || '',
      rank: coin.rank || 999,
      rate: typeof coin.rate === 'number' ? coin.rate : 0,
      png64: coin.png64 || `https://cryptoicons.org/api/icon/${cleanCryptoCode(coin.code || coin.symbol).toLowerCase()}/64`,
      delta: {
        hour: coin.delta?.hour || 0,
        day: coin.delta?.day || 0,
        week: coin.delta?.week || 0,
        month: coin.delta?.month || 0
      }
    };
  }

  static deltaToPercentage(delta: number): number {
    return (delta -1) * 100;
  }

  /**
   * Transforme un tableau de données de crypto-monnaies
   * @param coins Le tableau de données brutes
   * @returns Le tableau de données transformées
   */
  static transformCoins(coins: MarketData[]): MarketData[] {
    return coins.map(coin => this.transformCoin(coin));
  }
}

export default CryptoMiddleware; 