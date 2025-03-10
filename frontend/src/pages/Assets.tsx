import { useState, useEffect } from 'react';
import CryptoActionButton from '../components/CryptoActionButton';
import FeaturedCoinCard from '../components/FeaturedCoinCard';
import FundActionButton from '../components/FundActionButton';
import CryptoTable, { TableColumn, CellRenderers, BaseCryptoData } from '../components/CryptoTable';

interface CryptoData extends BaseCryptoData {
  amount: number;
  value: number;
  delta: {
    hour: number;
    day: number;
    week: number;
    month: number;
  };
}

interface WalletData {
  totalBalance: number;
  availableCash: number;
  cryptoAssets: number;
}

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

const Assets = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [walletData] = useState<WalletData>({
    totalBalance: 64926.32,
    availableCash: 10000.00,
    cryptoAssets: 54926.32
  });

  useEffect(() => {
    fetch('/coindata.json')
      .then(response => response.json())
      .then(() => {
        // Mock data for portfolio
        const portfolioData: CryptoData[] = [
          {
            name: "Bitcoin",
            code: "BTC",
            rate: 96265.38,
            amount: 0.50,
            value: 48132.69,
            png64: "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/btc.png",
            delta: {
              hour: 0,
              day: -0.08,
              week: 1.12,
              month: 0
            }
          },
          {
            name: "Ethereum",
            code: "ETH",
            rate: 2717.45,
            amount: 2.50,
            value: 6793.63,
            png64: "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/eth.png",
            delta: {
              hour: 0,
              day: 0.45,
              week: 4.37,
              month: 0.28
            }
          }
        ];
        setCryptoData(portfolioData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Mock data for featured coins
  const featuredCoins: CoinData[] = [
    {
      name: "Bitcoin",
      code: "BTC",
      rate: 96265.38,
      rank: 1,
      png64: "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/btc.png",
      delta: {
        hour: 1.00,
        day: 0.9992,
        week: 1.0112,
        month: 0.8946,
        quarter: 0.9858,
        year: 1.8222
      }
    },
    {
      name: "Ethereum",
      code: "ETH",
      rate: 2717.45,
      rank: 2,
      png64: "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/eth.png",
      delta: {
        hour: 1.0028,
        day: 1.0045,
        week: 1.0437,
        month: 1.0028,
        quarter: 1.0,
        year: 1.0
      }
    },
    {
      name: "XRP",
      code: "XRP",
      rate: 2.61,
      rank: 3,
      png64: "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/xrp.png",
      delta: {
        hour: 1.0075,
        day: 0.9986,
        week: 1.0887,
        month: 1.0,
        quarter: 1.0,
        year: 1.0
      }
    },
    {
      name: "Tether",
      code: "USDT",
      rate: 1.00,
      rank: 4,
      png64: "https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/usdt.png",
      delta: {
        hour: 0.9999,
        day: 0.9988,
        week: 0.9992,
        month: 1.0,
        quarter: 1.0,
        year: 1.0
      }
    }
  ];

  const portfolioColumns: TableColumn<CryptoData>[] = [
    {
      key: 'asset',
      header: 'Asset',
      render: CellRenderers.nameWithImage
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item) => <span>{formatNumber(item.amount)} {item.code}</span>
    },
    {
      key: 'price',
      header: 'Price',
      render: CellRenderers.price
    },
    {
      key: 'value',
      header: 'Value',
      render: (item) => <span>${formatNumber(item.value)}</span>
    },
    {
      key: 'change',
      header: '24h',
      render: CellRenderers.percentChange
    },
    {
      key: 'actions',
      header: 'Actions',
      render: CellRenderers.buySellActions,
      className: 'text-center'
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-white shadow-sm rounded-lg p-5">
          <h3 className="text-gray-500 text-lg font-medium mb-1">Total Balance</h3>
          <p className="text-2xl font-bold mb-3">${formatNumber(walletData.totalBalance)}</p>
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-gray-500">24h</span>
              <span className="text-red-500 ml-1">-0.01%</span>
            </div>
            <div>
              <span className="text-gray-500">7d</span>
              <span className="text-green-500 ml-1">+1.52%</span>
            </div>
            <div>
              <span className="text-gray-500">30d</span>
              <span className="text-red-500 ml-1">-11.52%</span>
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-sm rounded-lg p-5">
          <h3 className="text-gray-500 text-lg font-medium mb-1">Available Cash</h3>
          <p className="text-2xl font-bold mb-3">${formatNumber(walletData.availableCash)}</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <FundActionButton action="deposit" fullWidth={true} />
            </div>
            <div className="flex-1">
              <FundActionButton action="withdraw" fullWidth={true} />
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-sm rounded-lg p-5">
          <h3 className="text-gray-500 text-lg font-medium mb-1">Crypto Assets</h3>
          <p className="text-2xl font-bold mb-3">${formatNumber(walletData.cryptoAssets)}</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <CryptoActionButton action="buy" fullWidth={true} />
            </div>
            <div className="flex-1">
              <CryptoActionButton action="sell" fullWidth={true} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4">Your Portfolio</h2>
        <CryptoTable
          data={cryptoData}
          columns={portfolioColumns}
          emptyMessage="Your portfolio is empty. Start by buying some crypto!"
        />
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4">Featured Coins</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {featuredCoins.map((coin) => (
            <FeaturedCoinCard 
              key={coin.code} 
              coin={coin} 
              onBuy={() => console.log(`Buy ${coin.code}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assets;