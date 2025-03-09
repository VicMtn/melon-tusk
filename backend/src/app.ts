import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import CoinData from './models/CoinData';
import { startFetching } from './services/liveCoinWatchService';
import { AuthService } from './services/AuthService.js';
import { authMiddleware } from './middleware/authMiddleware';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('Connected to MongoDB: melon-tusk'))
  .catch((err) => console.error('MongoDB connection error:', err));

  startFetching();

const authService = new AuthService(process.env.JWT_SECRET!);

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authService.register(email, password);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
});

app.get('/coins', authMiddleware, async (req, res) => {
  const { datetime } = req.query;
  const userId = (req as any).user.userId; 

  try {
    if (!datetime || isNaN(new Date(datetime as string).getTime())) {
      return res.status(400).json({ error: 'Invalid datetime format. Use ISO format (e.g., "2025-02-23T00:30:40.464Z").' });
    }

    const coinData = await CoinData.find({
      timestamp: { $gte: new Date(datetime as string) },
    }).sort({ timestamp: 1 });


    const groupedCoinData = coinData.reduce((acc, data) => {
      if (!acc[data.code]) {
        acc[data.code] = {
          code: data.code,
          rates: [],
          volume: data.volume,
          cap: data.cap,
          delta: data.delta,
        };
      }
      acc[data.code].rates.push(data.rate);
      acc[data.code].volume = data.volume;
      acc[data.code].cap = data.cap;
      acc[data.code].delta = data.delta;
      return acc;
    }, {} as Record<string, any>);

    const response = {
      fetchInterval: parseInt(process.env.FETCH_INTERVAL!, 10),
      coins: Object.values(groupedCoinData),
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching coin data:', error);
    res.status(500).json({ error: 'Failed to fetch coin data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});