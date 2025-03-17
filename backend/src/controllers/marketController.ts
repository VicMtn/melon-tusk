import { Request, Response } from 'express';
import { getFearAndGreedIndex } from '../services/coinMarketCapService';
import { getCoinsTop50List, getCoinByCode } from '../services/liveCoinWatchService';
import { getLatestArticles } from '../services/coinDeskService';
import Coin from '../models/Coin';
import envConfig from '../config/envConfig';

export const getMarketFearAndGreed = async (req: Request, res: Response) => {
    try {
        const fearAndGreedIndex = await getFearAndGreedIndex();
        res.json(fearAndGreedIndex);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch fear and greed index' });
    }
};

export const getTop50Coins = async (req: Request, res: Response) => {
    try {
        const coinsList = await getCoinsTop50List();
        res.json(coinsList);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch top 50 coins' });
    }
};

export const getCoin = async (req: Request, res: Response) => {
    try {
        const coinCode = req.params.code;
        if (!coinCode) {
            return res.status(400).json({ error: 'Coin code is required' });
        }

        const coinData = await getCoinByCode(coinCode);
        res.json(coinData);
    } catch (error: any) {
        if (error.message === 'Coin not found') {
            return res.status(404).json({ error: `Coin ${req.params.code} not found` });
        }
        if (error.response?.status === 400) {
            return res.status(400).json({ error: 'Invalid coin code' });
        }
        res.status(500).json({ error: `Failed to fetch data for coin ${req.params.code}` });
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

export const startPeriodicCoinUpdate = () => {
    const updateCoins = async () => {
        try {
            const coinsData = await getCoinsTop50List();
            if (!Array.isArray(coinsData)) {
                console.error('Invalid response format. Expected an array of coins but got:', typeof coinsData);
                return;
            }
            await Coin.bulkInsertTop50List(coinsData);
            console.log('Periodic coin update completed successfully');
        } catch (error) {
            console.error('Error during periodic coin update:', error);
            if (error instanceof Error) {
                console.error('Error details:', error.message);
            }
        }
    };

    updateCoins();

    const interval = envConfig.lcwInterval;
    setInterval(updateCoins, interval);
    console.log(`Periodic coin update scheduled every ${interval/1000} seconds`);
}; 