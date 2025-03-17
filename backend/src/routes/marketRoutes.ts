import { Router } from 'express';
import { 
    getMarketFearAndGreed,
    getTop50Coins,
    getCoin,
    getNews
} from '../controllers/marketController';

const router = Router();

// Routes du marché
router.get('/fear-and-greed', getMarketFearAndGreed);
router.get('/coins-top50', getTop50Coins);
router.get('/coin/:code', getCoin);
router.get('/articles', getNews);

export default router;