import { useState, useEffect } from 'react';

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

interface CoinCardProps {
  title: string;
  coin: CoinData;
}

const CoinCard: React.FC<CoinCardProps> = ({ title, coin }) => {
  return (
    <div className="card w-full">
      <div className="card-body p-3 sm:p-4">
        <div className="text-base-content/50 mb-2">
          {title}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <img
                src={coin.png64}
                alt={coin.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
              />
              <div className="flex flex-col">
                <div className="card-title text-base sm:text-lg leading-none">{coin.code}</div>
                <div className="text-base-content/50 text-xs sm:text-sm">{coin.name}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-base-content/50 text-xs sm:text-sm">Rate</div>
              <div className="font-semibold text-right text-base sm:text-lg truncate max-w-[160px]">
                ${coin.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex flex-col">
              <div className="text-base-content/50 text-xs">24h</div>
              <div className={`${coin.delta.day >= 1 ? 'text-success' : 'text-error'}`}>
                {((coin.delta.day - 1) * 100).toFixed(2)}%
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-base-content/50 text-xs">7d</div>
              <div className={`${coin.delta.week >= 1 ? 'text-success' : 'text-error'}`}>
                {((coin.delta.week - 1) * 100).toFixed(2)}%
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-base-content/50 text-xs">1h</div>
              <div className={`${coin.delta.hour >= 1 ? 'text-success' : 'text-error'}`}>
                {((coin.delta.hour - 1) * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CoinCardContainer: React.FC = () => {
  const [topRank, setTopRank] = useState<CoinData | null>(null);
  const [bestPerformer, setBestPerformer] = useState<CoinData | null>(null);

  useEffect(() => {
    fetch('/coindata.json')
      .then(response => response.json())
      .then(data => {
        const bitcoin = data.find((coin: CoinData) => coin.rank === 1);
        setTopRank(bitcoin);
        
        const bestDaily = data.reduce((best: CoinData, current: CoinData) => {
          return (current.delta.day > best.delta.day) ? current : best;
        }, data[0]);
        setBestPerformer(bestDaily);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  if (!topRank || !bestPerformer) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      <CoinCard title="Top Ranked" coin={topRank} />
      <CoinCard title="Daily Performance" coin={bestPerformer} />
    </div>
  );
}

export { CoinCard, CoinCardContainer };