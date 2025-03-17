import { Request, Response } from 'express';
import User from '../models/User';
import { validateEmail, validatePassword } from '../validations/userValidations';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        // Validations
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }
        if (!validatePassword(password)) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long and contain both letters and numbers' });
        }

        // Créer un wallet temporaire (à remplacer par votre logique de création de wallet)
        const tempWalletId = new Types.ObjectId();

        const user = await User.createUser({
            username,
            email,
            password,
            wallet: tempWalletId
        });

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email
        });
    } catch (error: any) {
        if (error.message === 'Username or email already exists') {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error creating user' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, envConfig.jwtSecret, { expiresIn: '2h' });
        
        // Renvoyer le token et les informations de l'utilisateur
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                wallet: user.wallet
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error during login' });
    }
};

export const getUserByUsername = async (req: Request, res: Response) => {
    try {
        const user = await User.findByUsername(req.params.username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const updates: any = {};

        if (email) {
            if (!validateEmail(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            updates.email = email;
        }

        if (password) {
            if (!validatePassword(password)) {
                return res.status(400).json({ error: 'Password must be at least 8 characters long and contain both letters and numbers' });
            }
            updates.password = password;
        }

        const user = await User.updateUserById(req.params.userId, updates);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
}; 