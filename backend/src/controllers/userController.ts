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
        if (await User.exists({ $or: [{ username }, { email }] })) {
            return res.status(409).json({ error: 'Username or email already exists' });
        }

        // Create a temporary wallet (to be replaced with your wallet creation logic)
        const tempWalletId = new Types.ObjectId();

        const user = await User.createUser({
            username,
            email,
            password,
            wallet: tempWalletId
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET!,
            { expiresIn: envConfig.jwtExpiresIn }
        );

        // Return token and user information
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                walletId: user.wallet.toString()
            }
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

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET!,
            { expiresIn: envConfig.jwtExpiresIn }
        );
        
        // Return token and user information
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                walletId: user.wallet._id.toString()
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error during login' });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error during logout' });
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

export const getMe = async (req: Request, res: Response) => {
    try {
        res.status(200).json((req as any).user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};


export const changePassword = async (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById((req as any).user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (!validatePassword(newPassword)) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long and contain both letters and numbers' });
        }
        User.changePassword((req as any).user.id, newPassword );
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error changing password' });
    }
}


export const changeUser = async (req: Request, res: Response) => {
    try {
        const { email, username, currentPassword } = req.body;
        const updates: any = {};
        const actualPassword = await User.findById((req as any).user.id).select('password');
        const isMatch = await actualPassword.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (email) {
            if (!validateEmail(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }
            updates.email = email;
        }
        console.log("got here");
        if (username) {
            updates.username = username;
        }
        console.log("got here");
        const user = await User.updateUserById((req as any).user.id, updates);
        console.log("got here");
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log("got here");
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
}
