import createAxiosInstance from "./index";
import config from "../config/envConfig";
import { ICoin } from "../interfaces/ICoin";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface Cache {
  [key: string]: CacheEntry<any>;
}

const CACHE_TTL = 300 * 1000; // 5 minute cache
const cache: Cache = {};

const lcwApi = createAxiosInstance({
  baseURL: "https://api.livecoinwatch.com",
  apiKeys: {
    "x-api-key": config.lcw_api_key,
  },
});

// Add throttling mechanism
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000; // 5 seconds minimum between requests

const throttleRequest = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
};

const getCachedData = <T>(key: string): T | null => {
  const entry = cache[key];
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > CACHE_TTL) {
    delete cache[key];
    return null;
  }

  return entry.data;
};

const setCacheData = <T>(key: string, data: T): void => {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
};

export const getCoinsTop50List = async (): Promise<ICoin[]> => {
  const cacheKey = 'top50List';
  const cachedData = getCachedData<ICoin[]>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  try {
    await throttleRequest();
    const response = await lcwApi.post("/coins/list", {
      currency: "USD",
      sort: "rank",
      order: "ascending",
      offset: 0,
      limit: 50,
      meta: true,
    });
    
    setCacheData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching coins list:", error);
    throw error;
  }
};

export const getCoinByCode = async (
  code: string
): Promise<ICoin> => {
  const cacheKey = `coin_${code.toLowerCase()}`;
  const cachedData = getCachedData<ICoin>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  try {
    await throttleRequest();
    const response = await lcwApi.post("/coins/single", {
      currency: "USD",
      code: code.toUpperCase(),
      meta: true,
    });

    if (!response.data) {
      throw new Error("Coin not found");
    }

    setCacheData(cacheKey, response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      `Error fetching coin ${code}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateCoinData = async (): Promise<void> => {
  try {
    const coins = await getCoinsTop50List();
    setInterval(async () => {
      const coins = await getCoinsTop50List();
    }, config.lcwInterval);
  } catch (error) {
    console.error("Error updating coin data:", error);
  }
};
