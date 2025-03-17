import { Router, Response, Request } from 'express';
import { 
    deposit,
    withdraw,
    buyCrypto,
    sellCrypto,
    getTransactionHistory
} from '../controllers/transactionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Routes de gestion des fonds
router.post('/deposit', authMiddleware, deposit as any);
router.post('/withdraw', authMiddleware, withdraw as any);

// Routes de trading
router.post('/buy', authMiddleware, buyCrypto as any);
router.post('/sell', authMiddleware, sellCrypto as any);

// Route d'historique
router.get('/history', authMiddleware, getTransactionHistory as any);

export default router; 