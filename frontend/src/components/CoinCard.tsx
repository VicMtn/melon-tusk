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
      <div className="card-body">
        <div className="text-base-content/50 mb-3">
          {title}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <img
                src={coin.png64}
                alt={coin.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col justify-center">
                <div className="card-title text-lg md:text-2xl leading-none">{coin.code}</div>
                <div className="text-base-content/50 text-sm md:text-xl">{coin.name}</div>
              </div>
            </div>
            <div className="flex flex-col md:grid md:grid-cols-2 items-center">
              <div className="text-base-content/50 text-lg md:text-3xl">Rate:</div>
              <div className="font-semibold text-right text-lg md:text-3xl">
                ${coin.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm md:text-lg">
              <div className="grid grid-cols-2 items-center">
                <div className="text-base-content/50">24h:</div>
                <div className={`text-right ${coin.delta.day >= 1 ? 'text-success' : 'text-error'}`}>
                  {((coin.delta.day - 1) * 100).toFixed(2)}%
                </div>
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="text-base-content/50">7d:</div>
                <div className={`text-right ${coin.delta.week >= 1 ? 'text-success' : 'text-error'}`}>
                  {((coin.delta.week - 1) * 100).toFixed(2)}%
                </div>
              </div>
              <div className="grid grid-cols-2 items-center">
                <div className="text-base-content/50">1h:</div>
                <div className={`text-right ${coin.delta.hour >= 1 ? 'text-success' : 'text-error'}`}>
                  {((coin.delta.hour - 1) * 100).toFixed(2)}%
                </div>
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
    <div className="flex flex-col md:flex-row gap-4">
      <CoinCard title="Top Ranked" coin={topRank} />
      <CoinCard title="Best Daily Performance" coin={bestPerformer} />
    </div>
  );
}

export { CoinCard, CoinCardContainer };