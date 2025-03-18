import mongoose, { Schema } from 'mongoose';
import { ICoin, CoinModel } from '../interfaces/ICoin';

const coinSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    symbol: { 
        type: String
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
        min: 0
    },
    markets: {
        type: Number,
        min: 0
    },
    pairs: {
        type: Number,
        min: 0
    },
    allTimeHighUSD: {
        type: Number,
        min: 0
    },
    circulatingSupply: {
        type: Number,
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
        },
        quarter: {
            type: Number,
        },
        year: {
            type: Number,
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
//coinSchema.index({ code: 1});
//coinSchema.index({ rank: 1 });
//coinSchema.index({ cap: -1 });
//coinSchema.index({ volume: -1 });

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

// Fonction pour réinitialiser les index
/*
export const resetIndexes = async () => {
    try {
        // Supprimer tous les index existants sauf _id
        await Coin.collection.dropIndexes();
        console.log('Tous les index ont été supprimés');
        
        // Recréer uniquement les index nécessaires
        await Coin.collection.createIndex({ rank: 1 });
        await Coin.collection.createIndex({ cap: -1 });
        await Coin.collection.createIndex({ volume: -1 });
        console.log('Index nécessaires recréés avec succès');
    } catch (error) {
        console.error('Erreur lors de la réinitialisation des index:', error);
        throw error;
    }
};*/

export default Coin;
