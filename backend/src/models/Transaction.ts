import mongoose, { Schema } from 'mongoose';
import { ITransaction, TransactionModel, TransactionType } from '../interfaces/ITransaction';

const transactionSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    },
    walletId: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    type: { 
        type: String, 
        enum: ['buy', 'sell', 'deposit', 'withdraw'],
        required: true
    },
    code: { 
        type: String,
        uppercase: true,
        required: function(this: { type: TransactionType }) {
            return this.type === 'buy' || this.type === 'sell';
        }
    },
    amount: { 
        type: Number, 
        required: true,
        min: 0
    },
    rate: { 
        type: Number,
        required: function(this: { type: TransactionType }) {
            return this.type === 'buy' || this.type === 'sell';
        },
        min: 0
    },
    total: { 
        type: Number, 
        required: true,
        min: 0 
    },
    currency: {
        type: String,
        uppercase: true,
        default: 'USD'
    }
}, {
    timestamps: true
});

// Index pour la recherche rapide par utilisateur
transactionSchema.index({ userId: 1, createdAt: -1 });

// Méthodes simples de lecture
transactionSchema.statics.findByUserId = async function(
    userId: string
): Promise<ITransaction[]> {
    return this.find({ userId })
        .sort({ createdAt: -1 })
        .lean();
};

transactionSchema.statics.findByUserIdAndType = async function(
    userId: string,
    type: TransactionType
): Promise<ITransaction[]> {
    return this.find({ userId, type })
        .sort({ createdAt: -1 })
        .lean();
};

// Création simple d'une transaction
transactionSchema.statics.logTransaction = async function(
    data: {
        userId: mongoose.Types.ObjectId;
        walletId: mongoose.Types.ObjectId;
        type: TransactionType;
        code?: string;
        amount: number;
        rate?: number;
        total: number;
        currency?: string;
    }
): Promise<ITransaction> {
    const transaction = new this(data);
    return transaction.save();
};

transactionSchema.statics.findByUserIdAndCode = async function(
    userId: string,
    code: string
): Promise<ITransaction[]> {
    return this.find({ userId, code })
        .sort({ createdAt: -1 })
        .lean();
}

const Transaction = mongoose.model<ITransaction, TransactionModel>('Transaction', transactionSchema);

export default Transaction; 