import { Router } from 'express';
import { login, register, logout, changePassword, changeUser } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Routes d'authentification
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/verify', authMiddleware, (req, res) => res.status(200).json({ valid: true }));
router.post('/change-password', authMiddleware, changePassword);
router.post('/change-user', authMiddleware, changeUser);

export default router;
