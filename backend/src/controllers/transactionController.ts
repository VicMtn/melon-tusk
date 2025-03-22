import { Response } from 'express';
import Transaction from '../models/Transaction';
import Wallet from '../models/Wallet';
import { Types } from 'mongoose';
import { CreateTransactionInput, TransactionType } from '../interfaces/ITransaction';
import { AuthRequest } from '../interfaces/IAuthRequest';

// Validation helper
const validateAmount = (amount: number, res: Response): boolean => {
    if (!amount || amount <= 0) {
        res.status(400).json({ error: 'Invalid amount' });
        return false;
    }
    return true;
};

const createTransaction = async (data: CreateTransactionInput, res: Response) => {
    try {
        const transaction = await Transaction.logTransaction(data);
        res.status(201).json(transaction);
    } catch (error: any) {
        if (error.message.includes('Insufficient') || error.message.includes('Invalid')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Transaction failed' });
        }
    }
};

export const deposit = async (req: AuthRequest, res: Response) => {
    const { amount } = req.body;
    const { id: userId, wallet: walletId } = req.user;

    if (!validateAmount(amount, res)) return;
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
    }
    Wallet.deposit(wallet.id, amount);

    await createTransaction({
        userId: new Types.ObjectId(userId),
        walletId: new Types.ObjectId(walletId),
        type: 'deposit',
        amount,
        total: amount,
        currency: 'USD'
    }, res);
};

export const withdraw = async (req: AuthRequest, res: Response) => {
    const { amount } = req.body;
    const { id: userId, wallet: walletId } = req.user;

    if (!validateAmount(amount, res)) return;
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
    }
    if (wallet.balance < amount) {
        return res.status(400).json({ 
            error: 'Insufficient funds',
            required: amount,
            available: wallet.balance
        });
    }
    Wallet.withdraw(wallet.id, amount);

    await createTransaction({
        userId: new Types.ObjectId(userId),
        walletId: new Types.ObjectId(walletId),
        type: 'withdraw',
        amount,
        total: amount,
        currency: 'USD'
    }, res);
};

export const buyCrypto = async (req: AuthRequest, res: Response) => {
    const { code, amount, rate } = req.body;
    const { id: userId, wallet: walletId } = req.user;

    if (!validateAmount(amount, res) || !validateAmount(rate, res)) return;
    if (!code) {
        return res.status(400).json({ error: 'Invalid crypto code' });
    }

    try {
        // Vérifier le solde du wallet
        const wallet = await Wallet.findById(walletId);
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        const totalCost = amount * rate;
        if (wallet.balance < totalCost) {
            return res.status(400).json({ 
                error: 'Insufficient funds',
                required: totalCost,
                available: wallet.balance
            });
        }

        Wallet.buyAsset(wallet.id, code, amount, rate);
        
        await createTransaction({
            userId: new Types.ObjectId(userId),
            walletId: new Types.ObjectId(walletId),
            type: 'buy',
            code: code.toUpperCase(),
            amount,
            rate,
            total: totalCost,
            currency: 'USD'
        }, res);
    } catch (error: any) {
        console.error('Error during buy transaction:', error);
        res.status(500).json({ error: 'Transaction failed' });
    }
};

export const sellCrypto = async (req: AuthRequest, res: Response) => {
    const { code, amount, rate } = req.body;
    const { id: userId, wallet: walletId } = req.user;

    if (!validateAmount(amount, res) || !validateAmount(rate, res)) return;
    if (!code) {
        return res.status(400).json({ error: 'Invalid crypto code' });
    }

    try {
        // Vérifier la disponibilité des crypto-monnaies
        const wallet = await Wallet.findById(walletId);
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        const assetAmount = wallet.getAssetAmount(code);
        if (assetAmount < amount) {
            return res.status(400).json({ 
                error: `Insufficient ${code} balance`,
                required: amount,
                available: assetAmount
            });
        }

        Wallet.sellAsset(wallet.id, code, amount, rate);

        await createTransaction({
            userId: new Types.ObjectId(userId),
            walletId: new Types.ObjectId(walletId),
            type: 'sell',
            code: code.toUpperCase(),
            amount,
            rate,
            total: amount * rate,
            currency: 'USD'
        }, res);
    } catch (error: any) {
        console.error('Error during sell transaction:', error);
        res.status(500).json({ error: 'Transaction failed' });
    }
};

export const getTransactionHistory = async (req: AuthRequest, res: Response) => {
    try {
        const { id: userId } = req.user;
        const { type } = req.query;

        const transactions = type && ['buy', 'sell', 'deposit', 'withdraw'].includes(type as string)
            ? await Transaction.findByUserIdAndType(userId, type as TransactionType)
            : await Transaction.findByUserId(userId);

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching transaction history' });
    }
};

export const getTransactionHistorybyCode = async (user: any, code: string) => {
    try {
        const userId = user.id;
        const coinCode = code;

        const transactions = await Transaction.findByUserIdAndCode(userId, coinCode);

        return transactions;
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        return [];
    }
}
