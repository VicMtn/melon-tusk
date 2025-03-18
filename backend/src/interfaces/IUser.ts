import { Document, Types, Schema, Model } from 'mongoose';
import mongoose from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    wallet: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserModel extends Model<IUser> {
    createUser(userData: CreateUserInput): Promise<IUser>;
    findByUsername(username: string): Promise<IUser | null>;
    findByEmail(email: string): Promise<IUser | null>;
    updateUserById(userId: string, updateData: Partial<CreateUserInput>): Promise<IUser | null>;
}

export const userSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        minlength: 2 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: true,
        select: false
    },
    wallet: { 
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    }
}, {
    timestamps: true
});

export interface CreateUserInput {
    username: string;
    email: string;
    password: string;
    wallet?: mongoose.Types.ObjectId;
}

export interface IPassword extends Document {
    password: string;
}
