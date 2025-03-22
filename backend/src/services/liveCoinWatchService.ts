import createAxiosInstance from "./index";
import config from "../config/envConfig";
import { ICoin } from "../interfaces/ICoin";

const lcwApi = createAxiosInstance({
  baseURL: "https://api.livecoinwatch.com",
  apiKeys: {
    "x-api-key": config.lcw_api_key,
  },
});

export const getCoinsTop50List = async (): Promise<ICoin[]> => {
  try {
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
