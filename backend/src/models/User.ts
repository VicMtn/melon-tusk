import mongoose from 'mongoose';
import { IUser, userSchema, CreateUserInput, UserModel } from '../interfaces/IUser';
import { hashPassword, addAuthMethods } from '../middleware/authMiddleware';
import Wallet from './Wallet';

// Appliquer les middlewares
hashPassword(userSchema);
addAuthMethods(userSchema);

// Méthodes statiques
userSchema.statics.createUser = async function(userData: CreateUserInput): Promise<IUser> {
    try {
        // Créer un nouveau wallet
        const wallet = await Wallet.createWallet();
        
        // Créer l'utilisateur avec le wallet
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

// Créer et exporter le modèle
export default mongoose.model<IUser, UserModel>('User', userSchema);