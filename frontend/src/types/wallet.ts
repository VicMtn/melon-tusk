export interface IWallet {
    id: string;
    balance: number;
    totalAssetsValue: number;
    assets: Asset[];
}

export interface Asset {
    code: string;
    amount: number;
    currentValue: number;
    rate: number;
    profitLoss: number;
    profitLossPercentage: number;
}
