import { Request, Response } from 'express';
import { fetchCoinData } from './marketController';
import { getTransactionHistorybyCode } from './transactionController';
import { IUser } from '../interfaces/IUser';
import { ITransaction } from '../interfaces/ITransaction';

export const getWalletBalance = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const wallet = user.wallet;

        const assets = await Promise.all(
            wallet.assets.map(async (asset: any) => {
                const assetData = await fetchCoinData(asset.code);
                const profitLoss = await getProfitLossOnCoin(user, asset.code, assetData.rate);
                return {
                    code: asset.code,
                    amount: asset.amount,
                    currentValue: assetData.rate * asset.amount,
                    rate: assetData.rate,
                    profitLoss: profitLoss
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

const getProfitLossOnCoin = async (user: IUser, code: string, currentRate: number) => {
    const transactions = await getTransactionHistorybyCode(user, code);
    let profitLoss = 0;
    transactions.forEach((transaction: ITransaction) => {
        profitLoss += getTransactionProfitLoss(transaction, currentRate);
    });
    return profitLoss;
}

const getTransactionProfitLoss = (transaction: ITransaction, currentRate: number) => {
    if (transaction.type === 'buy') {
        return (currentRate - transaction.rate!) * transaction.amount;
    } else if (transaction.type === 'sell') {
        return (transaction.rate! - currentRate) * transaction.amount;
    }
    return 0;
};