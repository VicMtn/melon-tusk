import { useState, useEffect } from 'react';
import CryptoActionButton from '../components/CryptoActionButton';
import FeaturedCoinCard from '../components/FeaturedCoinCard';
import FundActionButton from '../components/FundActionButton';
import CryptoTable, { TableColumn } from '../components/CryptoTable';
import TransactionModal from '../components/TransactionModal';
import { CoinData } from '../types/crypto';
import {IWallet, Asset} from '../types/wallet';
import marketService from '../services/marketService';
import walletService from '../services/walletService';
import transactionService from '../services/transactionService';

const Assets = () => {
  const [topCoins, setTopCoins] = useState<CoinData[]>([]);
  const [walletData, setWalletData] = useState<IWallet>({
    id: '1',
    balance: 0,
    totalAssetsValue: 0,
    assets: []
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'buy' | 'sell' | 'deposit' | 'withdraw'>('buy');
  const [selectedCrypto, setSelectedCrypto] = useState<Pick<CoinData, 'code' | 'name' | 'rate' | 'png64'> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coinsResponse = await marketService.getAllMarket();
        setTopCoins(coinsResponse.slice(0, 4));
      } catch (error) {
        console.error('Error fetching coins:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const walletAssets = await walletService.getUserWallet();
        setWalletData(walletAssets);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };
    fetchWalletData();
  }, []);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleTransactionClick = (type: 'buy' | 'sell' | 'deposit' | 'withdraw', crypto?: Pick<CoinData, 'code' | 'name' | 'rate' | 'png64'>) => {
    setModalType(type);
    if (crypto) {
      setSelectedCrypto(crypto);
    } else {
      setSelectedCrypto(null);
    }
    setIsModalOpen(true);
  };

  const handleTransactionSubmit = async (amount: number, total: number) => {
    try {
      if (modalType === 'deposit' || modalType === 'withdraw') {
        await transactionService.handleWalletOperation(modalType, amount);
      } else if (modalType === 'buy' && selectedCrypto) {
        await transactionService.buyCrypto(selectedCrypto.code, amount);
      } else if (modalType === 'sell' && selectedCrypto) {
        await transactionService.sellCrypto(selectedCrypto.code, amount);
      }
      
      const updatedWallet = await walletService.getUserWallet();
      setWalletData(updatedWallet);
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  const portfolioColumns: TableColumn<Asset>[] = [
    {
      key: 'asset',
      header: 'Asset',
      render: (item) => (
        <div className="flex items-center gap-2">
          <img src={`https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/${item.code.toLowerCase()}.png`} alt={item.code} className="w-8 h-8" />
          <span>{item.code}</span>
        </div>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item) => <span>{formatNumber(item.amount)} {item.code}</span>
    },
    {
      key: 'price',
      header: 'Price',
      render: (item) => <span>${formatNumber(item.rate)}</span>
    },
    {
      key: 'value',
      header: 'Value',
      render: (item) => <span>${formatNumber(item.currentValue)}</span>
    },
    {
      key: 'change',
      header: '+/-',
      render: (item) => (
        <span className={item.profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'}>
          {item.profitLossPercentage >= 0 ? '+' : ''}{formatNumber(item.profitLossPercentage)}%
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex justify-center gap-2">
          <CryptoActionButton
            action="buy"
            size="sm"
            onClick={() => handleTransactionClick('buy', {
              code: item.code,
              name: item.code,
              rate: item.rate,
              png64: `https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/${item.code.toLowerCase()}.png`
            })}
          />
          <CryptoActionButton
            action="sell"
            size="sm"
            onClick={() => handleTransactionClick('sell', {
              code: item.code,
              name: item.code,
              rate: item.rate,
              png64: `https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/${item.code.toLowerCase()}.png`
            })}
          />
        </div>
      ),
      className: 'text-center'
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl font-medium">Assets</div>
      <div className="divider m-0 h-1"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-white shadow-sm rounded-lg p-5">
          <h3 className="text-gray-500 text-lg font-medium mb-1">Total Balance</h3>
          <p className="text-2xl font-bold mb-3">${formatNumber(walletData.totalAssetsValue + walletData.balance)}</p>
          <div className="flex justify-between text-sm">
          </div>
        </div>

        <div className="card bg-white shadow-sm rounded-lg p-5">
          <h3 className="text-gray-500 text-lg font-medium mb-1">Available Cash</h3>
          <p className="text-2xl font-bold mb-3">${formatNumber(walletData.balance)}</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <FundActionButton 
                action="deposit"
                fullWidth={true}
                onClick={() => handleTransactionClick('deposit')}
              />
            </div>
            <div className="flex-1">
              <FundActionButton 
                action="withdraw"
                fullWidth={true}
                onClick={() => handleTransactionClick('withdraw')}
              />
            </div>
          </div>
        </div>

        <div className="card bg-white shadow-sm rounded-lg p-5">
          <h3 className="text-gray-500 text-lg font-medium mb-1">Crypto Assets</h3>
          <p className="text-2xl font-bold mb-3">${formatNumber(walletData.totalAssetsValue)}</p>
          <div className="flex gap-2">
            <div className="flex-1">
              <CryptoActionButton 
                action="buy"
                fullWidth={true}
                onClick={() => handleTransactionClick('buy')}
              />
            </div>
            <div className="flex-1">
              <CryptoActionButton 
                action="sell"
                fullWidth={true}
                onClick={() => handleTransactionClick('sell')}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-m font-medium mb-4">Your Portfolio</h2>
        <CryptoTable
          data={walletData.assets}
          columns={portfolioColumns}
          emptyMessage="Your portfolio is empty. Start by buying some crypto!"
        />
      </div>
      <div>
        <h2 className="text-m font-medium mb-4">Featured Coins</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {topCoins.map((coin) => (
            <FeaturedCoinCard 
              key={coin.code} 
              coin={coin} 
              onBuy={() => handleTransactionClick('buy', {
                code: coin.code,
                name: coin.name,
                rate: coin.rate,
                png64: coin.png64
              })}
            />
          ))}
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        cryptoData={selectedCrypto || undefined}
        balance={modalType === 'withdraw' ? walletData.balance : 
                modalType === 'sell' ? (walletData.assets.find(a => a.code === selectedCrypto?.code)?.amount || 0) : 
                walletData.balance}
        onSubmit={handleTransactionSubmit}
      />
    </div>
  );
};

export default Assets;