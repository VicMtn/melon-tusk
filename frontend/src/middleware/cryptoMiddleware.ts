import { CoinData } from '../types/crypto';
import { cleanCryptoCode } from '../utils/formatters';

/**
 * Middleware to transform crypto-monnaies data
 */
export class CryptoMiddleware {

  static transformCoin(coin: CoinData): CoinData {
    return {
      ...coin,
      code: cleanCryptoCode(coin.code || coin.symbol || ''),
      symbol: coin.symbol || '',
      name: coin.name || '',
      rank: coin.rank || 999,
      rate: typeof coin.rate === 'number' ? coin.rate : 0,
      png64: coin.png64 || `https://cryptoicons.org/api/icon/${cleanCryptoCode(coin.code || coin.symbol || '').toLowerCase()}/64`,
      delta: {
        hour: coin.delta?.hour || 0,
        day: coin.delta?.day || 0,
        week: coin.delta?.week || 0,
        month: coin.delta?.month || 0,
        quarter: coin.delta?.quarter || 0,
        year: coin.delta?.year || 0
      }
    };
  }

  static deltaToPercentage(delta: number): number {
    return (delta -1) * 100;
  }

  static transformCoins(coins: CoinData[]): CoinData[] {
    return coins.map(coin => this.transformCoin(coin));
  }
}

export default CryptoMiddleware; 