import { Document, Model } from "mongoose";

export interface ICoin extends Document {
    name: string;
    symbol?: string | null;
    rank: number;
    age: number;
    color: string;
    png32: string;
    png64: string;
    webp32: string;
    webp64: string;
    exchanges?: number | null;
    markets?: number | null;
    pairs?: number | null;
    allTimeHighUSD: number;
    circulatingSupply: number;
    totalSupply: number;
    maxSupply?: number | null;
    categories?: string[] | null;
    links: {
        website: string | null,
        whitepaper: string | null,
        twitter: string | null,
        reddit: string | null,
        telegram: string | null,
        discord: string | null,
        medium: string | null,
        instagram: string | null,
        tiktok: string | null,
        youtube: string | null,
        linkedin: string | null,
        twitch: string | null,
        spotify: string | null,
        naver: string | null,
        wechat: string | null,
        soundcloud: string | null;
    },
    code: string;
    rate: number;
    volume: number;
    cap: number;
    liquidity?: number | null;
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