import { Request } from 'express';
import { Types } from 'mongoose';

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  wallet: Types.ObjectId;
}

export interface AuthRequest extends Request {
  user: AuthenticatedUser;
}

export type AuthHandler = (req: AuthRequest, res: Response) => Promise<any>; 