import axios from 'axios';
import { Coin } from '../models/Coin.js';


export const fetchCoinData = async (): Promise<void> => {
  try {
    const response = await axios.post(
      'https://api.livecoinwatch.com/coins/map',
      {
        codes: process.env.LCW_CODES!.split(','),
        currency: 'USD',
        sort: 'rank',
        order: 'ascending',
        offset: 0,
        limit: 0,
        meta: false,
      },
      {
        headers: {
          'content-type': 'application/json',
          'x-api-key': process.env.LCW_KEY!,
        },
      }
    );

    const coinData = response.data.map(
      (coin: any) =>
        new Coin(
          coin.code,
          coin.rate,
          coin.volume,
          coin.cap,
          coin.delta
        )
    );

    for (const coin of coinData) {
      await coin.save();
    }

    console.log('Coin data saved to MongoDB');
  } catch (error) {
    console.error('Error fetching or saving coin data:', error);
  }
};


export const startFetching = () => {
  fetchCoinData();
  setInterval(fetchCoinData, parseInt(process.env.FETCH_INTERVAL!, 10));
};

