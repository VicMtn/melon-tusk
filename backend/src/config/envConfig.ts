import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement depuis le fichier .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Fonction pour vérifier si une variable d'environnement est définie
const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
};

// Configuration de l'application
interface Config {
  // Serveur
  port: number;
  
  // Base de données
  mongoUri: string;
  
  // API LiveCoinWatch
  lcw_api_key: string;
  lcwCodes: string[];
  lcwInterval: number;

  // API CoinMarketCap
  cmc_api_key: string;

  // API CoinDesk
  coindesk_api_key: string;

  // Authentification
  jwtSecret: string;
  jwtExpiresIn: string;
  
  // CORS
  corsOrigin: string;
}

// Exporter la configuration
const config: Config = {
  // Serveur
  port: parseInt(process.env.PORT || '5678', 10),
  
  // Base de données
  mongoUri: requireEnv('MONGO_URI'),
  
  // API LiveCoinWatch
  lcw_api_key: requireEnv('LCW_KEY'),
  lcwCodes: requireEnv('LCW_CODES').split(','),
  lcwInterval: parseInt(process.env.LCW_INTERVAL || '15000', 10),
  
  // API CoinMarketCap
  cmc_api_key: requireEnv('CMC_API_KEY'),

  // API CoinDesk
  coindesk_api_key: requireEnv('COINDESK_API_KEY'),

  // Authentification
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};

export default config; 