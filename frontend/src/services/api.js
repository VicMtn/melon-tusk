import axios from 'axios';

/**
 * Client API
 */
const apiClient = axios.create({

  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Interceptor for the responses
 * Only extract the data
 */
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Propagate the error
    return Promise.reject(error);
  }
);

/**
 * Base Structure for all the call on API services
 * @param {string} baseUrl
 * @param {string} endpoint
 * @param {Object} params
 * @param {Object} data
 * @returns {Promise}
 */

export class ApiService {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  get(endpoint, params = {}) {
    return apiClient.get(`${this.baseUrl}${endpoint}`, { params });
  }

  post(endpoint, data = {}) {
    return apiClient.post(`${this.baseUrl}${endpoint}`, data);
  }

  put(endpoint, data = {}) {
    return apiClient.put(`${this.baseUrl}${endpoint}`, data);
  }

  patch(endpoint, data = {}) {
    return apiClient.patch(`${this.baseUrl}${endpoint}`, data);
  }

  delete(endpoint) {
    return apiClient.delete(`${this.baseUrl}${endpoint}`);
  }
}

export default apiClient;
