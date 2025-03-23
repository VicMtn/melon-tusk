import mongoose, { Types } from "mongoose";
import User from "../models/User";
import Wallet from "../models/Wallet";
import Transaction from "../models/Transaction";
import bcrypt from 'bcrypt';
import envConfig from "../config/envConfig";

// Configuration MongoDB
const MONGODB_URI = envConfig.mongoUri;

// Interfaces pour les données de test
interface TestAsset {
  code: string;
  amount: number;
}

interface TestTransaction {
  type: 'deposit' | 'buy' | 'sell' | 'withdraw';
  amount: number;
  total: number;
  currency?: string;
  code?: string;
  rate?: number;
  date?: Date;
}

interface TestUser {
  username: string;
  email: string;
  password: string;
  initialBalance: number;
  assets: TestAsset[];
  transactions: TestTransaction[];
}

// Données de test
const users: TestUser[] = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'cpnv1234',
    initialBalance: 18400,
    assets: [
      { code: 'BTC', amount: 2.2 },
      { code: 'ETH', amount: 18.0 },
      { code: 'DOGE', amount: 14000 },
      { code: 'SOL', amount: 234 },
      { code: 'XRP', amount: 151 },
      { code: 'ADA', amount: 890 },
      { code: 'DOT', amount: 34 },
      { code: 'LINK', amount: 300 },
      { code: 'UNI', amount: 9864 },
      { code: 'BCH', amount: 88 },
      { code: 'LTC', amount: 10000 },
      { code: 'XLM', amount: 3 }
    ],
    transactions: [
      { 
        type: 'deposit', 
        amount: 500000, 
        total: 500000, 
        currency: 'USD',
        date: new Date('2024-03-01T10:00:00Z')
      },
      { 
        type: 'buy', 
        code: 'BTC', 
        amount: 3.0, 
        rate: 42000, 
        total: 126000,
        date: new Date('2024-03-01T10:30:00Z')
      },
      { 
        type: 'buy', 
        code: 'ETH', 
        amount: 25.0, 
        rate: 2800, 
        total: 70000,
        date: new Date('2024-03-01T11:00:00Z')
      },
      { 
        type: 'buy', 
        code: 'DOGE', 
        amount: 20000, 
        rate: 0.15, 
        total: 3000,
        date: new Date('2024-03-01T11:30:00Z')
      },
      {
        type: 'sell',
        code: 'BTC',
        amount: 0.8,
        rate: 45000,
        total: 36000,
        date: new Date('2024-03-02T14:30:00Z')
      },
      {
        type: 'sell',
        code: 'ETH',
        amount: 7.0,
        rate: 3200,
        total: 22400,
        date: new Date('2024-03-02T15:00:00Z')
      },
      {
        type: 'sell',
        code: 'DOGE',
        amount: 6000,
        rate: 0.18,
        total: 1080,
        date: new Date('2024-03-02T15:30:00Z')
      },
      { 
        type: 'buy', 
        code: 'SOL', 
        amount: 234, 
        rate: 110, 
        total: 25740,
        date: new Date('2024-03-03T10:00:00Z')
      },
      { 
        type: 'buy', 
        code: 'XRP', 
        amount: 151, 
        rate: 0.58, 
        total: 87.58,
        date: new Date('2024-03-03T10:30:00Z')
      },
      { 
        type: 'buy', 
        code: 'ADA', 
        amount: 1000, 
        rate: 0.45, 
        total: 450,
        date: new Date('2024-03-03T11:00:00Z')
      },
      {
        type: 'sell',
        code: 'ADA',
        amount: 110,
        rate: 0.42,
        total: 46.2,
        date: new Date('2024-03-03T16:00:00Z')
      },
      { 
        type: 'buy', 
        code: 'DOT', 
        amount: 34, 
        rate: 7.2, 
        total: 244.8,
        date: new Date('2024-03-04T10:00:00Z')
      },
      { 
        type: 'buy', 
        code: 'LINK', 
        amount: 400, 
        rate: 15.8, 
        total: 6320,
        date: new Date('2024-03-04T10:30:00Z')
      },
      {
        type: 'sell',
        code: 'LINK',
        amount: 100,
        rate: 16.2,
        total: 1620,
        date: new Date('2024-03-04T14:00:00Z')
      },
      { 
        type: 'buy', 
        code: 'UNI', 
        amount: 9864, 
        rate: 7.4, 
        total: 72993.6,
        date: new Date('2024-03-05T10:00:00Z')
      },
      { 
        type: 'buy', 
        code: 'BCH', 
        amount: 88, 
        rate: 235, 
        total: 20680,
        date: new Date('2024-03-05T10:30:00Z')
      },
      { 
        type: 'buy', 
        code: 'LTC', 
        amount: 12000, 
        rate: 20.5, 
        total: 246000,
        date: new Date('2024-03-05T11:00:00Z')
      },
      {
        type: 'sell',
        code: 'LTC',
        amount: 2000,
        rate: 22.8,
        total: 45600,
        date: new Date('2024-03-05T15:30:00Z')
      },
      { 
        type: 'buy', 
        code: 'XLM', 
        amount: 3, 
        rate: 0.11, 
        total: 0.33,
        date: new Date('2024-03-05T16:00:00Z')
      }
    ]
  },
  {
    username: 'alice_trader',
    email: 'alice@example.com',
    password: 'Password123!',
    initialBalance: 10000,
    assets: [
      { code: 'BTC', amount: 0.5 },
      { code: 'ETH', amount: 4.0 },
      { code: 'DOGE', amount: 1000 }
    ],
    transactions: [
      { type: 'deposit', amount: 10000, total: 10000, currency: 'USD' },
      { type: 'buy', code: 'BTC', amount: 0.5, rate: 40000, total: 20000 },
      { type: 'buy', code: 'ETH', amount: 4.0, rate: 2500, total: 10000 },
      { type: 'buy', code: 'DOGE', amount: 1000, rate: 0.1, total: 100 }
    ]
  },
  {
    username: 'bob_hodler',
    email: 'bob@example.com',
    password: 'Password123!',
    initialBalance: 5000,
    assets: [
      { code: 'BTC', amount: 0.25 },
      { code: 'ETH', amount: 2.0 }
    ],
    transactions: [
      { type: 'deposit', amount: 5000, total: 5000, currency: 'USD' },
      { type: 'buy', code: 'BTC', amount: 0.25, rate: 42000, total: 10500 },
      { type: 'buy', code: 'ETH', amount: 2.0, rate: 2600, total: 5200 }
    ]
  },
  {
    username: 'carol_investor',
    email: 'carol@example.com',
    password: 'Password123!',
    initialBalance: 15000,
    assets: [
      { code: 'BTC', amount: 0.75 },
      { code: 'ETH', amount: 6.0 },
      { code: 'DOGE', amount: 2000 }
    ],
    transactions: [
      { type: 'deposit', amount: 15000, total: 15000, currency: 'USD', date: new Date('2024-03-01') },
      { type: 'buy', code: 'BTC', amount: 0.75, rate: 41000, total: 30750, date: new Date('2024-03-02') },
      { type: 'buy', code: 'ETH', amount: 6.0, rate: 2550, total: 15300, date: new Date('2024-03-03') },
      { type: 'buy', code: 'DOGE', amount: 2000, rate: 0.11, total: 220, date: new Date('2024-03-04') }
    ]
  }
];

async function seed() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Nettoyer la base de données
    await Promise.all([
      User.deleteMany({}),
      Wallet.deleteMany({}),
      Transaction.deleteMany({})
    ]);
    console.log('Database cleaned');

    // Créer les utilisateurs
    for (const userData of users) {
      const { transactions, assets, initialBalance, ...userInput } = userData;
      
      // Créer l'utilisateur (cela créera automatiquement un wallet)
      const user = await User.createUser(userInput);

      // Mettre à jour le wallet avec les assets et le solde initial
      await Wallet.findByIdAndUpdate(user.wallet, {
        balance: initialBalance,
        assets: assets.map(asset => ({
          code: asset.code,
          amount: asset.amount
        }))
      });

      // Créer les transactions
      await Transaction.insertMany(
        transactions.map(transaction => ({
          ...transaction,
          userId: user._id,
          walletId: user.wallet
        }))
      );

      console.log(`Created user: ${userData.username} with wallet and transactions`);
    }

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Exécuter le seeder
seed(); 