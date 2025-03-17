import { ApiService } from './api';

/**
 * User Service
 */
class UserService extends ApiService {
  constructor() {
    super('/users');
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.get('/me');
  }

  /**
   * Get User by ID
   */
  getUserById(id) {
    return this.get(`/${id}`);
  }

  /**
   * Get all users
   * Can be useful if we want to display a list of users for Melon-Tusk
   */
  getUsers() {
    return this.get('/all');
  }

  /**
   * Update User Profile
   */
  updateProfile(userData) {
    return this.put('/me', userData);
  }

  /**
   * Change User Password
   * Avoid passing the whole profile data
   */
  changePassword(passwordData) {
    return this.post('/me/change-password', passwordData);
  }

  /**
   * Get User Watchlist
   */
  getWatchlist() {
    return this.get('/watchlist');
  }

  /**
   * Add Crypto to Watchlist
   */
  addCryptoToWatchlist(cryptoCode) {
    return this.post('/watchlist', { cryptoCode });
  }

  /**
   * Remove Crypto from Watchlist
   */
  removeCryptoFromWatchlist(cryptoCode) {
    return this.delete(`/watchlist/${cryptoCode}`);
  }
  
}
export default new UserService();
