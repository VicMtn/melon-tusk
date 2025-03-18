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
    initialBalance: 10000,
    assets: [
      { code: 'BTC', amount: 4.2 },
      { code: 'ETH', amount: 18.0 },
      { code: 'DOGE', amount: 14000 }
    ],
    transactions: [
      { type: 'deposit', amount: 100000, total: 100000, currency: 'USD' },
      { type: 'buy', code: 'BTC', amount: 4.2, rate: 40000, total: 168000 },
      { type: 'buy', code: 'ETH', amount: 18.0, rate: 2500, total: 45000 },
      { type: 'buy', code: 'DOGE', amount: 14000, rate: 0.1, total: 1400 }
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