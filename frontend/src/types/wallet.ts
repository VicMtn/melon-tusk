export interface WalletAsset {
    code: string;
    amount: number;
}

export interface WalletData {
    balance: number;
    assets: WalletAsset[];
}