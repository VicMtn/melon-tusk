import React, { useEffect, useState } from 'react';
import walletService, { WalletData } from '../services/walletService';
import marketService from '../services/marketService';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import axios, { AxiosError } from 'axios';

const UserWalletCard: React.FC = () => {
  const [userWallet, setUserWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalValue, setTotalValue] = useState(0);
  const [change24h, setChange24h] = useState(1);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [walletDataFromMongo, marketDataResult] = await Promise.all([
          walletService.getUserWallet(),
          marketService.getAllMarket()
        ]);
        
        console.log('Wallet data received:', walletDataFromMongo);
        console.log('Market data received:', marketDataResult);
        
        if (!walletDataFromMongo || !walletDataFromMongo.assets) {
          console.error('Invalid wallet data received:', walletDataFromMongo);
          setError('Impossible de récupérer votre portefeuille');
          setUserWallet(null);
          setTotalValue(0);
          setChange24h(1);
          return;
        }
        
        setUserWallet(walletDataFromMongo);
        
        if (!marketDataResult || !marketDataResult.length) {
          console.error('Invalid market data received:', marketDataResult);
          setError('Impossible de récupérer les données du marché');
          setTotalValue(0);
          setChange24h(1);
          return;
        }
        
        const { totalValue: calculatedTotal, change24h: calculatedChange } = 
          walletService.calculateWalletValue(walletDataFromMongo, marketDataResult);
        
        setTotalValue(calculatedTotal);
        setChange24h(calculatedChange);
      } catch (error: unknown) {
        console.error('Error fetching wallet data from MongoDB:', error);
        
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 404) {
            setError('L\'API de portefeuille n\'est pas disponible (404)');
          } else if (axiosError.code === 'ECONNREFUSED') {
            setError('Impossible de se connecter au serveur');
          } else {
            setError(`Erreur: ${axiosError.message || 'Une erreur est survenue'}`);
          }
        } else {
          setError('Une erreur inconnue est survenue');
        }
        
        setUserWallet(null);
        setTotalValue(0);
        setChange24h(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const getBgColorClass = () => {
    if (error) return "bg-error/10";
    if (change24h > 1.05) return "bg-success/30";
    if (change24h > 1) return "bg-success/20";
    if (change24h > 1) return "bg-success/20";
    if (change24h < 0.95) return "bg-error/30";
    if (change24h < 1) return "bg-error/20";
    return "bg-base-200";
  };

  const isEmptyWallet = userWallet && (!userWallet.assets || userWallet.assets.length === 0);

  return (
    <div className={`card glass w-full sm:w-1/3 ${getBgColorClass()}`}>
      <div className="card-body">
        <div className="text-base-content/50 mb-3">My wallet</div>
        {loading ? (
          <div className="skeleton h-10 w-3/4 mb-4"></div>
        ) : error ? (
          <div className="flex flex-col gap-2">
            <div className="text-error mb-2">{error}</div>
            <button 
              className="btn btn-sm btn-outline" 
              onClick={handleRetry}
            >
              Error during wallet recovery
            </button>
          </div>
        ) : isEmptyWallet ? (
          <div className="text-base mb-4">No assets in your wallet</div>
        ) : (
          <>
            <div className="text-4xl mb-2">{formatCurrency(totalValue)}</div>
            <div className={`text-sm mb-4 ${change24h >= 1 ? 'text-success' : 'text-error'}`}>
              {formatPercentage(change24h)} on 24h
            </div>
            {userWallet && (
              <div className="text-xs text-base-content/50 mb-2">
                {userWallet.assets.length} assets in your wallet
              </div>
            )}
          </>
        )}
        <div className="card-actions">
          <a href="/assets" className="link link-primary no-underline">
            See my wallet
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserWalletCard;