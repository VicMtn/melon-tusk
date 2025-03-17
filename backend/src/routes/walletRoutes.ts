import { Router } from 'express';
import { getWalletBalance, getAssetBalance } from '../controllers/walletController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Routes du wallet
router.get('/balance', getWalletBalance);
router.get('/asset/:code', getAssetBalance);

export default router; 