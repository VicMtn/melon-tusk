import { Router } from 'express';
import { 
    getUserByUsername, 
    updateUser, 
    getUserById 
} from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Routes protégées
router.get('/username/:username', authMiddleware, getUserByUsername);
router.get('/:id', authMiddleware, getUserById);
router.patch('/:userId', authMiddleware, updateUser);

export default router;