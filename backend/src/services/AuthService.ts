import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Asset from '../models/Asset';

export class AuthService {
  private secretKey: string;
  private coinCodes: string[];

  constructor(secretKey: string, coinCodes: string[]) {
    this.secretKey = secretKey;
    this.coinCodes = coinCodes;
  }

  async register(email: string, password: string): Promise<IUser> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = new User({ email, password });
    await user.save();

    for (const coinId of this.coinCodes) {
        const asset = new Asset({ userId: user._id, coinId, amount: 0 });
        await asset.save();
    }

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