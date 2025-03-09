import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { startFetching } from './services/liveCoinWatchService.js';
import { CoinDeskService } from './services/CoinDeskService.js';



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('Connected to MongoDB: melon-tusk'))
  .catch((err) => console.error('MongoDB connection error:', err));

startFetching(); // Start fetching coin data every defined interval

let coinDeskService = new CoinDeskService();

app.get('/news', async (req, res) => {
  try {
    const newsArticles = await coinDeskService.fetchNewsArticles();
    res.json(newsArticles); // Send the news articles as a JSON response
  } catch (error) {
    console.error('Error fetching news articles:', error);
    res.status(500).json({ error: 'Failed to fetch news articles' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});