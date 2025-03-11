import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { startFetching } from './services/liveCoinWatchService';
import { AuthService } from './services/AuthService.js';
import { authMiddleware } from './middleware/authMiddleware';
import Asset from './models/Asset';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('Connected to MongoDB: melon-tusk'))
  .catch((err) => console.error('MongoDB connection error:', err));

  startFetching();

const authService = new AuthService(process.env.JWT_SECRET!, process.env.LCW_CODES!.split(','));

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await authService.register(username, email, password);
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

app.put('/assets', authMiddleware, async (req, res) => {
  const userId = (req as any).user.userId;
  const assets: { coinId: string; amount: number }[] = req.body;

  try {
    const validCoins = process.env.LCW_CODES!.split(',');
    for (const asset of assets) {
      if (!validCoins.includes(asset.coinId)) {
        return res.status(400).json({ error: `Invalid coinId: ${asset.coinId}` });
      }
    }

    for (const asset of assets) {
      await Asset.findOneAndUpdate(
        { userId, coinId: asset.coinId },
        { amount: asset.amount },
        { upsert: true, new: true }
      );
    }

    res.json({ message: 'Portfolio updated successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/assets', authMiddleware, async (req, res) => {
  const userId = (req as any).user.userId;

  try {
    let assets = await Asset.find({ userId });

    res.json(assets);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});