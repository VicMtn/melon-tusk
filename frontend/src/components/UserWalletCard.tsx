import React, { useEffect, useState } from 'react';
import walletService from '../services/walletService';
import { formatCurrency } from '../utils/formatters';
import { IWallet } from '../types/wallet';

const UserWalletCard: React.FC = () => {
  const [userWallet, setUserWallet] = useState<IWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [walletData] = await Promise.all([
          walletService.getUserWallet(),
        ]);
        setUserWallet(walletData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const isEmptyWallet = userWallet && (!userWallet.assets || userWallet.assets.length === 0);

  return (
    <div className={`card glass w-full sm:w-1/3 bg-orange-200`}>
      <div className="card-body">
        <div className="text-base-content/50 mb-3">My wallet</div>
        {loading ? (
          <div className="skeleton h-10 w-3/4 mb-4"></div>
        ) : error ? (
          <div className="flex flex-col gap-2">
            <div className="text-error mb-2">{error}</div>
            <button 
              className="btn btn-sm btn-outline" 
            >
              Error during wallet recovery
            </button>
          </div>
        ) : isEmptyWallet ? (
          <div className="text-base mb-4">No assets in your wallet</div>
        ) : (
          <>
            <div className="text-4xl mb-2">{formatCurrency(userWallet?.balance) || 0}</div>
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