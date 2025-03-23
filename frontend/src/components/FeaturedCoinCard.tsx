import React from 'react';
import { CoinCard } from './CoinCard';
import BuyCryptoButton from './BuyCryptoButton';
import { CoinData } from '../types/crypto';

interface FeaturedCoinCardProps {
  coin: CoinData;
  onBuy?: () => void;
}

const FeaturedCoinCard: React.FC<FeaturedCoinCardProps> = ({ coin, onBuy }) => {
  const handleSuccess = () => {
    if (onBuy) onBuy();
  };
  
  return (
    <div className="flex flex-col">
      <div className="card bg-white shadow-sm rounded-lg">
        <CoinCard title={coin.name} coin={coin} />
      </div>
      <div className="mt-2">
        <BuyCryptoButton 
          cryptoData={{
            code: coin.code,
            name: coin.name,
            rate: coin.rate,
            png64: coin.png64
          }}
          fullWidth={true}
          size="md"
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default FeaturedCoinCard; 