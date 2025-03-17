import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiKeys {
  [key: string]: string;
}

interface AxiosInstanceConfig {
  baseURL: string;
  apiKeys?: ApiKeys;
  timeout?: number;
}

export const createAxiosInstance = (config: AxiosInstanceConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (reqConfig: InternalAxiosRequestConfig) => {
      if (config.apiKeys) {
        Object.entries(config.apiKeys).forEach(([key, value]) => {
          reqConfig.headers[key] = value;
        });
      }
      return reqConfig;
    },
    (error) => Promise.reject(error)
  );


  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createAxiosInstance;