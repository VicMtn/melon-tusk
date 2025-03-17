import { Document, Model } from "mongoose";

export interface ICoin extends Document {
    name: string;
    rank: number;
    age: number;
    color: string;
    png32: string;
    png64: string;
    webp32: string;
    webp64: string;
    exchanges: number;
    markets: number;
    pairs: number;
    allTimeHighUSD: number;
    circulatingSupply: number;
    totalSupply?: number | null;
    maxSupply?: number | null;
    categories?: string[];
    links: {
        website?: string,
        whitepaper?: string,
        twitter?: string;
        reddit?: string;
        telegram?: string;
        discord?: string;
        medium?: string;
        instagram?: string;
        tiktok?: string;
        youtube?: string;
        linkedin?: string;
        twitch?: string;
        spotify?: string;
        naver?: string;
        wechat?: string;
        soundcloud?: string;
    },
    code: string;
    rate: number;
    volume: number;
    cap: number;
    delta: {
        hour: number;
        day: number;
        week: number;
        month: number;
        quarter: number;
        year: number;
    };
    lastUpdated: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Itop50Coins {
    data: ICoin[];
}

export interface CoinModel extends Model<ICoin> {
    findBySymbol(symbol: string): Promise<ICoin | null>;
    updateCoinData(symbol: string, data: Partial<ICoin>): Promise<ICoin | null>;
    findTopCoins(limit?: number): Promise<ICoin[]>;
    bulkInsertTop50List(coins: ICoin[]): Promise<void>;
    findByCode(code: string): Promise<ICoin | null>;
    getCoinList(): Promise<ICoin[]>;
}

export interface SingleCoinResponse {
    code: string;
    rate: number;
    volume: number;
    cap: number;
    delta: {
        hour: number;
        day: number;
        week: number;
        month: number;
        quarter: number;
        year: number;
    };
    meta?: {
        name: string;
        description?: string;
        website?: string;
        explorer?: string;
    };
}