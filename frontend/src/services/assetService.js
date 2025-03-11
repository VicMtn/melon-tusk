import { ApiService } from './api';

/**
 * Assets Service
 */
class WalletService extends ApiService {
    constructor() {
        super('/assets');
    }

/**
 * Get User assets
 */
getAssets() {
    return this.get('/');
}

/**
 * Get User wallet Balance
 */
getWalletBalance(userId) {
    return this.get(`/balance/${userId}`);
}

/**
 * Add funds to assets
 */
addFundsToWallet(amount) {
return this.post('/add-funds', { amount });
}

/**
 * Withdraw funds from wallet
 */
withdrawFundsFromWallet(amount) {
    return this.post('/withdraw', { amount });
}

/**
 * Get User assets Transactions
 */
getTransactions(userId) {
    return this.get(`/transactions/${userId}`);
}

/**
 * Buy Crypto
 */
buyCrypto(cryptoCode, amount) {
    return this.post(`/buy/${cryptoCode}`, { amount });
}

/**
 * Sell Crypto
 */
sellCrypto(cryptoCode, amount) {
    return this.post(`/sell/${cryptoCode}`, { amount });
}

}
export default new WalletService();