import { Request, Response } from 'express';
import { getFearAndGreedIndex } from '../services/coinMarketCapService';
import { getCoinsTop50List, getCoinByCode } from '../services/liveCoinWatchService';
import { getLatestArticles } from '../services/CoinDeskService';
import envConfig from '../config/envConfig';
import Wallet from '../models/Wallet';

export const getMarketFearAndGreed = async (req: Request, res: Response) => {
    try {
        const fearAndGreedIndex = await getFearAndGreedIndex();
        res.json(fearAndGreedIndex);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch fear and greed index' });
    }
};

export const getNews = async (req: Request, res: Response) => {
    try {
        const articles = await getLatestArticles();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch latest articles' });
    }
};


const fetchCoinData = async (code: string) => {
    try {
        const coinCode = code.toUpperCase();
        if (!coinCode) {
            throw new Error('Coin code is required');
        }

        const coinData = await getCoinByCode(coinCode);
        return coinData;
    } catch (error: any) {
        if (error.message === 'Coin not found') {
            throw { status: 404, message: `Coin ${code} not found` };
        }
        if (error.response?.status === 400) {
            throw { status: 400, message: 'Invalid coin code' };
        }
        throw { status: 500, message: `Failed to fetch data for coin ${code}` };
    }
};


export const getAllCoins = async (req: Request, res: Response) => {
    try {

        const user = (req as any).user;
        let coins = await getCoinsTop50List();
        const userCoinsCodes = user.wallet.assets.map((coin: any) => coin.code);
        const missingCoins = userCoinsCodes.filter((code: string) => !coins.find((coin: any) => coin.code === code));

        if (missingCoins.length > 0) {
            const missingCoinsData = await Promise.all(missingCoins.map(fetchCoinData));
            coins = coins.concat(missingCoinsData);
        }

        res.json(coins);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch top 50 coins' });
    }
};

export const getACoin = async (req: Request, res: Response) => {
    try {
        const code = req.params.code;
        const coinData = await fetchCoinData(code);
        res.json(coinData);
    } catch (error: any) {
        res.status(error.status || 500).json({ error: error.message });
    }
};