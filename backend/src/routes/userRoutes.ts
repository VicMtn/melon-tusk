import { Router } from 'express';
import { 
    getUserByUsername, 
    updateUser, 
    getUserById, 
    getMe
} from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Protected routes
router.get('/username/:username', authMiddleware, getUserByUsername);
router.get('/:id', authMiddleware, getUserById);
router.patch('/:userId', authMiddleware, updateUser);
router.get('/', authMiddleware, getMe);

export default router;