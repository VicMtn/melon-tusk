import { Document, Model, ClientSession } from 'mongoose';
import mongoose from 'mongoose';

export interface Asset {
    code: string;
    amount: number;
}

export interface IWallet extends Document {
    balance: number;
    assets: Asset[];
    createdAt: Date;
    updatedAt: Date;
    getBalance(): number;
    getAssetAmount(code: string): number;
}

export interface WalletModel extends Model<IWallet> {
    createWallet(): Promise<IWallet>;
    findByIdAndUpdateBalance(id: string, amount: number, session?: ClientSession): Promise<IWallet | null>;
    findByIdAndUpdateAsset(id: string, code: string, amount: number, session?: ClientSession): Promise<IWallet | null>;
}

export const walletSchema = new mongoose.Schema<IWallet>({
    balance: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    assets: [{
        code: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        _id: false // Désactiver l'ID automatique pour les sous-documents
    }]
}, {
    timestamps: true
});