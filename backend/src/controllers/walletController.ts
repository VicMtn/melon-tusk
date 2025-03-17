import { Request, Response } from 'express';
import Wallet from '../models/Wallet';
import { Types } from 'mongoose';

export const getWalletBalance = async (req: Request, res: Response) => {
    try {
        const walletId = req.params.walletId;
        const wallet = await Wallet.findById(walletId);
        
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        res.json({
            balance: wallet.balance,
            assets: wallet.assets
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching wallet balance' });
    }
};

export const getAssetBalance = async (req: Request, res: Response) => {
    try {
        const { walletId, code } = req.params;
        const wallet = await Wallet.findById(walletId);
        
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        const asset = wallet.assets.find(a => a.code === code.toUpperCase());
        if (!asset) {
            return res.json({ amount: 0 });
        }

        res.json({ amount: asset.amount });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching asset balance' });
    }
}; 