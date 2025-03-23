import React from 'react';
import { CoinCard } from './CoinCard';
import CryptoActionButton from './CryptoActionButton';
import { CoinData } from '../types/crypto';

interface FeaturedCoinCardProps {
  coin: CoinData;
  onBuy?: () => void;
}

const FeaturedCoinCard: React.FC<FeaturedCoinCardProps> = ({ coin, onBuy }) => {
  return (
    <div className="flex flex-col">
      <div className="card bg-white shadow-sm rounded-lg">
        <CoinCard title={coin.name} coin={coin} />
      </div>
      <div className="mt-2">
        <CryptoActionButton action="buy" fullWidth onClick={onBuy} />
      </div>
    </div>
  );
};

export default FeaturedCoinCard; 