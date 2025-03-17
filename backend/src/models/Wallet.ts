import mongoose, { Schema, ClientSession } from 'mongoose';
import { IWallet, WalletModel } from '../interfaces/IWallet';

const walletSchema = new Schema({
    balance: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        validate: {
            validator: function(value: number) {
                return value >= 0;
            },
            message: 'Balance cannot be negative'
        }
    },
    assets: [{
        code: {
            type: String,
            required: true,
            uppercase: true
        },
        amount: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
            validate: {
                validator: function(value: number) {
                    return value >= 0;
                },
                message: 'Asset amount cannot be negative'
            }
        },
        _id: false // Désactiver l'ID automatique pour les sous-documents
    }]
}, {
    timestamps: true
});

// Index pour les recherches fréquentes
walletSchema.index({ 'assets.code': 1 });

// Static methods
walletSchema.statics.createWallet = async function(): Promise<IWallet> {
    const wallet = new this({
        balance: 0,
        assets: []
    });
    return wallet.save();
};

walletSchema.statics.deposit = async function(
    id: string,
    amount: number
): Promise<IWallet | null> {
    if (amount <= 0) {
        throw new Error('Deposit amount must be positive');
    }
    return this.findByIdAndUpdate(
        id,
        { $inc: { balance: amount } },
        { new: true }
    );
};

walletSchema.statics.findByIdAndUpdateBalance = async function(
    id: string,
    amount: number,
    session?: ClientSession
): Promise<IWallet | null> {
    const wallet = await this.findById(id).session(session);
    if (!wallet) return null;
    
    const newBalance = wallet.balance + amount;
    if (newBalance < 0) {
        throw new Error('Insufficient balance');
    }
    
    return this.findByIdAndUpdate(
        id,
        { $set: { balance: newBalance } },
        { new: true, session }
    );
};

walletSchema.statics.findByIdAndUpdateAsset = async function(
    id: string,
    code: string,
    amount: number,
    session?: ClientSession
): Promise<IWallet | null> {
    const wallet = await this.findById(id).session(session);
    if (!wallet) return null;

    const assetIndex = wallet.assets.findIndex((asset: { code: string; amount: number }) => asset.code === code.toUpperCase());
    if (assetIndex === -1) {
        if (amount < 0) {
            throw new Error(`No ${code} assets available`);
        }
        wallet.assets.push({ code: code.toUpperCase(), amount });
    } else {
        const newAmount = wallet.assets[assetIndex].amount + amount;
        if (newAmount < 0) {
            throw new Error(`Insufficient ${code} assets`);
        }
        wallet.assets[assetIndex].amount = newAmount;
    }

    return wallet.save({ session });
};

// Méthodes pour obtenir les soldes
walletSchema.methods.getBalance = function(): number {
    return this.balance;
};

walletSchema.methods.getAssetAmount = function(code: string): number {
    const asset = this.assets.find((a: { code: string; amount: number }) => a.code === code.toUpperCase());
    return asset ? asset.amount : 0;
};

// Création du modèle
const Wallet = mongoose.model<IWallet, WalletModel>('Wallet', walletSchema);

export default Wallet; 