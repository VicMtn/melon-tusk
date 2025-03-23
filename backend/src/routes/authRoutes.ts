import { Router } from 'express';
import { login, register, logout } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Routes d'authentification
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/verify', authMiddleware, (req, res) => res.status(200).json({ valid: true }));

export default router;
