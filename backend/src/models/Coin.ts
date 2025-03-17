import mongoose, { Schema } from 'mongoose';
import { ICoin, CoinModel } from '../interfaces/ICoins';

const coinSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    symbol: { 
        type: String, 
        required: true,
        unique: true,
        uppercase: true,
        index: true
    },
    rank: {
        type: Number,
        required: true,
        min: 1
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    color: {
        type: String,
        required: true
    },
    png32: {
        type: String,
        required: true
    },
    png64: {
        type: String,
        required: true
    },
    webp32: {
        type: String,
        required: true
    },
    webp64: {
        type: String,
        required: true
    },
    exchanges: {
        type: Number,
        required: true,
        min: 0
    },
    markets: {
        type: Number,
        required: true,
        min: 0
    },
    pairs: {
        type: Number,
        required: true,
        min: 0
    },
    allTimeHighUSD: {
        type: Number,
        required: true,
        min: 0
    },
    circulatingSupply: {
        type: Number,
        required: true,
        min: 0
    },
    totalSupply: {
        type: Number,
        default: null
    },
    maxSupply: {
        type: Number,
        default: null
    },
    categories: [{
        type: String
    }],
    rate: {
        type: Number,
        required: true,
        min: 0
    },
    volume: {
        type: Number,
        required: true,
        min: 0
    },
    cap: {
        type: Number,
        required: true,
        min: 0
    },
    delta: {
        hour: {
            type: Number,
            required: true
        },
        day: {
            type: Number,
            required: true
        },
        week: {
            type: Number,
            required: true
        },
        month: {
            type: Number,
            required: true
        },
        quarter: {
            type: Number,
            required: true
        },
        year: {
            type: Number,
            required: true
        }
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true
});

// Index pour optimiser les requêtes
coinSchema.index({ rank: 1 });
coinSchema.index({ cap: -1 });
coinSchema.index({ volume: -1 });

// Méthodes CRUD
coinSchema.statics.bulkInsertTop50List = async function(
    coinsData: ICoin[]
): Promise<void> {
    try {
        // 1. Supprimer toutes les anciennes données
        await this.deleteMany({});

        // 2. Insérer les nouvelles données
        const newCoins = coinsData.map(coin => ({
            ...coin,
            lastUpdated: new Date()
        }));

        await this.insertMany(newCoins);
        
        console.log(`Successfully updated ${coinsData.length} coins`);
    } catch (error) {
        console.error('Error during bulk insert:', error);
        throw error;
    }
};

coinSchema.statics.findByCode = async function(
    code: string
): Promise<ICoin | null> {
    return this.findOne({ code: code.toUpperCase() });
};

coinSchema.statics.findTopCoins = async function(
    limit: number = 50
): Promise<ICoin[]> {
    return this.find()
        .sort({ rank: 1 })
        .limit(limit);
};

coinSchema.statics.getCoinList = async function(): Promise<ICoin[]> {
    return this.find()
        .sort({ rank: 1 })
        .lean()  // Optimisation pour la lecture seule
        .select('name symbol rank png64 allTimeHighUSD rate volume cap delta lastUpdated');
};

// Création du modèle avec les interfaces
const Coin = mongoose.model<ICoin, CoinModel>('Coin', coinSchema);

export default Coin;
