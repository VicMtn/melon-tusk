import { Router } from 'express';
import { getWalletBalance, getAssetBalance } from '../controllers/walletController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Wallet routes
router.get('/', getWalletBalance);
router.get('/asset/:code', getAssetBalance);

export default router; 