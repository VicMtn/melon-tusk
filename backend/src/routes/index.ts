import { Router } from 'express';
import authRoutes from './authRoutes';
import walletRoutes from './walletRoutes';
import transactionRoutes from './transactionRoutes';
import marketRoutes from './marketRoutes';

const router = Router();

// Routes d'API
router.use('/auth', authRoutes);
router.use('/wallet', walletRoutes);
router.use('/transactions', transactionRoutes);
router.use('/market', marketRoutes);

export default router; 