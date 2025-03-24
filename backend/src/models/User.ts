import mongoose from 'mongoose';
import { IUser, userSchema, CreateUserInput, UserModel } from '../interfaces/IUser';
import { hashPassword, addAuthMethods } from '../middleware/authMiddleware';
import Wallet from './Wallet';

// Apply middlewares
hashPassword(userSchema);
addAuthMethods(userSchema);

// Static methods
userSchema.statics.createUser = async function(userData: CreateUserInput): Promise<IUser> {
    try {
        // Create a new wallet
        const wallet = await Wallet.createWallet();
        
        // Create user with wallet
        const user = new this({
            ...userData,
            wallet: wallet._id
        });
        
        await user.save();
        return user;
    } catch (error: any) {
        if (error.code === 11000) {
            throw new Error('Username or email already exists');
        }
        throw error;
    }
};

userSchema.statics.changePassword = async function(userId: string, newPassword: string): Promise<IUser | null> {
    const user = await this.findById(userId);
    if (!user) {
        return null;
    }
    user.password = newPassword;
    await user.save();
    return user;
}

userSchema.statics.findByUsername = async function(username: string): Promise<IUser | null> {
    return this.findOne({ username }).populate('wallet');
};

userSchema.statics.findByEmail = async function(email: string): Promise<IUser | null> {
    return this.findOne({ email }).populate('wallet');
};

userSchema.statics.updateUserById = async function(
    userId: string,
    updateData: Partial<CreateUserInput>
): Promise<IUser | null> {
    return this.findByIdAndUpdate(userId, updateData, { new: true }).populate('wallet');
};

// Create and export model
export default mongoose.model<IUser, UserModel>('User', userSchema);