
export interface WalletAsset {
    coinId: string;
    amount: number;
  }
  
  export interface WalletData {
    _id: string;
    userId: string;
    balance: number;
    assets: WalletAsset[];
    createdAt: Date;
    updatedAt: Date;
  }