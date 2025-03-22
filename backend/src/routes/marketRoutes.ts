import { Router } from 'express';
import { 
    getMarketFearAndGreed,
    getNews,
    getAllCoins,
    getACoin
} from '../controllers/marketController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

// Routes du marché
router.get('/fear-and-greed', getMarketFearAndGreed);
router.get('/coins', getAllCoins)
router.get('/coins/:code', getACoin)
router.get('/articles', getNews);

export default router;