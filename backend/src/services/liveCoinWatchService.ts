import createAxiosInstance from "./index";
import config from "../config/envConfig";
import { ICoin } from "../interfaces/ICoin";

const lcwApi = createAxiosInstance({
  baseURL: "https://api.livecoinwatch.com",
  apiKeys: {
    "x-api-key": config.lcw_api_key,
  },
});

// Add throttling mechanism
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds minimum between requests

const throttleRequest = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
};

export const getCoinsTop50List = async (): Promise<ICoin[]> => {
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
    return response.data;
  } catch (error) {
    console.error("Error fetching coins list:", error);
    throw error;
  }
};

export const getCoinByCode = async (
  code: string
): Promise<ICoin> => {
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
