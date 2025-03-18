import { Request, Response } from 'express';

export const getWalletBalance = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;

        res.json({
            balance: user.wallet.balance,
            assets: user.wallet.assets
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