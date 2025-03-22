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

walletSchema.statics.buyAsset = async function(
    id: string,
    code: string,
    amount: number,
    rate: number,
    session?: ClientSession
): Promise<IWallet | null> {
    if (amount <= 0 || rate <= 0) {
        throw new Error('Amount and rate must be positive');
    }

    const wallet = await this.findById(id).session(session);
    if (!wallet) return null;

    const cost = amount * rate;
    if (wallet.balance < cost) {
        throw new Error('Insufficient balance to buy assets');
    }

    wallet.balance -= cost;

    const assetIndex = wallet.assets.findIndex((asset: { code: string; amount: number }) => asset.code === code.toUpperCase());
    if (assetIndex === -1) {
        wallet.assets.push({ code: code.toUpperCase(), amount });
    } else {
        wallet.assets[assetIndex].amount += amount;
    }

    return wallet.save({ session });
};

walletSchema.statics.sellAsset = async function(
    id: string,
    code: string,
    amount: number,
    rate: number,
    session?: ClientSession
): Promise<IWallet | null> {
    if (amount <= 0 || rate <= 0) {
        throw new Error('Amount and rate must be positive');
    }

    const wallet = await this.findById(id).session(session);
    if (!wallet) return null;

    const assetIndex = wallet.assets.findIndex((asset: { code: string; amount: number }) => asset.code === code.toUpperCase());
    if (assetIndex === -1 || wallet.assets[assetIndex].amount < amount) {
        throw new Error(`Insufficient ${code} assets to sell`);
    }

    const revenue = amount * rate;
    wallet.balance += revenue;
    wallet.assets[assetIndex].amount -= amount;

    if (wallet.assets[assetIndex].amount === 0) {
        wallet.assets.splice(assetIndex, 1); // Remove the asset if the amount is zero
    }

    return wallet.save({ session });
};

walletSchema.statics.deposit = async function(
    id: string,
    amount: number,
    session?: ClientSession
): Promise<IWallet | null> {
    if (amount <= 0) {
        throw new Error('Deposit amount must be positive');
    }

    const wallet = await this.findById(id).session(session);
    if (!wallet) return null;

    wallet.balance += amount;

    return wallet.save({ session });
};

walletSchema.statics.withdraw = async function(
    id: string,
    amount: number,
    session?: ClientSession
): Promise<IWallet | null> {
    if (amount <= 0) {
        throw new Error('Withdrawal amount must be positive');
    }

    const wallet = await this.findById(id).session(session);
    if (!wallet) return null;

    if (wallet.balance < amount) {
        throw new Error('Insufficient balance to withdraw');
    }

    wallet.balance -= amount;

    return wallet.save({ session });
};
// Création du modèle
const Wallet = mongoose.model<IWallet, WalletModel>('Wallet', walletSchema);

export default Wallet; 