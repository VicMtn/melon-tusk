import React from 'react';
import { CoinCard } from './CoinCard';
import CryptoActionButton from './CryptoActionButton';

interface CoinData {
  name: string;
  code: string;
  png64: string;
  rate: number;
  rank: number;
  delta: {
    hour: number;
    day: number;
    week: number;
    month: number;
    quarter: number;
    year: number;
  };
}

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