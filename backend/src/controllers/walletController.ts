import { Request, Response } from 'express';
import { fetchCoinData } from './marketController';
import { getTransactionHistorybyCode } from './transactionController';
import { IUser } from '../interfaces/IUser';
import { ITransaction } from '../interfaces/ITransaction';
import { get } from 'http';

export const getWalletBalance = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const wallet = user.wallet;

        const assets = await Promise.all(
            wallet.assets.map(async (asset: any) => {
                const assetData = await fetchCoinData(asset.code);
                const currentValue = assetData.rate * asset.amount;
                const profitLoss = currentValue - getTotalInvestment(await getTransactionHistorybyCode(user, asset.code));
                return {
                    code: asset.code,
                    amount: asset.amount,
                    currentValue: currentValue,
                    rate: assetData.rate,
                    profitLoss: profitLoss,
                    profitLossPercentage: (profitLoss / getTotalInvestment(await getTransactionHistorybyCode(user, asset.code))) * 100
                };
            })
        );

        res.json({
            _id: wallet._id,
            userId: user._id,
            balance: wallet.balance,
            assets,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching wallet balance' });
    }
};


export const getAssetBalance = async (req: Request, res: Response) => {
    try {
        const { code } = req.params;
        const wallet = (req as any).user.wallet;
        
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

const getTotalInvestment = (transactions: ITransaction[]) => {
    return transactions.reduce((total, transaction) => {
        if (transaction.type === 'buy') {
            return total + transaction.amount * transaction.rate!;
        } else if (transaction.type === 'sell') {
            return total - transaction.amount * transaction.rate!;
        }
        return total;
    }, 0);
}