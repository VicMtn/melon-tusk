export interface IWallet extends Document {
    id: string;
    balance: number;
    assets: Asset[];
}

export interface Asset {
    code: string;
    amount: number;
}
