import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.js';

export class AuthService {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async register(username: string, email: string, password: string): Promise<IUser> {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new Error('User already exists');
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new Error('Username already exists');
    }

    const user = new User({ username, email, password });
    await user.save();
    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ userId: user._id }, this.secretKey, {
      expiresIn: '1h',
    });
    return token;
  }
}