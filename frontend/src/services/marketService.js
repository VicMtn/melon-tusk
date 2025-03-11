import { ApiService } from './api';

/**
 * Market Service
 */
class MarketService extends ApiService {
  constructor() {
    super('/market');
  }


/**
 * Get top 50 crypto currencies
 */
getTop50Crypto() {
  return this.get('/top-50');
}

/**
 * Get best Crypto
 */
getBestCrypto() {
  return this.get('/best-crypto');
}

/**
 * Get top performer for 24h
 */
getTopPerformer24h() {
  return this.get('/top-performer-24h');
}

/**
 * Get 5 latest articles
 */
getLatestArticles() {
  return this.get('/latest-articles');
}
}
export default new MarketService();
