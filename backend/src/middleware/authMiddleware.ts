import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IPassword, IUser } from '../interfaces/IUser';
import User from '../models/User'; // Import your User model

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id)
      .select('-password')
      .populate('wallet');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    (req as any).user = user; // Attach the user object to the request
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

export const addAuthMethods = (schema: Schema): void => {
    schema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
        try {
            const user = await this.model('User').findById(this._id).select('+password') as (IUser & { password: string }) | null;
            if (!user) return false;
            
            return bcrypt.compare(candidatePassword, user.password);
        } catch (error) {
            return false;
        }
    };
};

export const hashPassword = (schema: Schema): void => {
  schema.pre('save', async function(this: IPassword, next) {
      if (!this.isModified('password')) return next();

      try {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
          next();
      } catch (error: any) {
          next(error);
      }
  });
};