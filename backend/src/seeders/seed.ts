import mongoose from "mongoose";
import User from "../models/User";
import Wallet from "../models/Wallet";
import Transaction from "../models/Transaction";
import bcrypt from 'bcrypt';
import envConfig from "../config/envConfig";

// Configuration MongoDB
const MONGODB_URI = envConfig.mongoUri;

// Données de test
const users = [
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

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

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

    // Créer les utilisateurs avec leurs wallets et transactions
    for (const userData of users) {
      try {
        // 1. Créer le wallet
        const wallet = await Wallet.createWallet();
        
        // 2. Mettre à jour le solde et les assets
        await Wallet.findByIdAndUpdate(wallet._id, {
          balance: userData.initialBalance,
          assets: userData.assets
        });

        // 3. Hasher le mot de passe
        const hashedPassword = await hashPassword(userData.password);

        // 4. Créer l'utilisateur
        const user = await User.create({
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          wallet: wallet._id
        });

        // 5. Créer les transactions
        const transactions = userData.transactions.map(t => ({
          userId: user._id,
          walletId: wallet._id,
          type: t.type,
          code: t.code,
          amount: t.amount,
          rate: t.rate,
          total: t.total,
          currency: t.currency || 'USD'
        }));

        await Transaction.insertMany(transactions);
        console.log(`Created user: ${userData.username} with wallet and transactions`);
      } catch (error) {
        console.error(`Error creating user ${userData.username}:`, error);
      }
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

// Exécuter le script
seed(); 