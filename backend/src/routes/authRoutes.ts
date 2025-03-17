import { Router } from 'express';
import { login, register } from '../controllers/userController';

const router = Router();

// Routes d'authentification
router.post('/register', register);
router.post('/login', login);

export default router;
