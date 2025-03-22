import { useState, useEffect } from 'react';
import CryptoTable, { TableColumn, CellRenderers } from '../components/CryptoTable';
import marketService from '../services/marketService';
import { CoinData } from '../types/crypto';
import { cleanCryptoCode } from '../utils/formatters';

const Markets: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CoinData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await marketService.getAllMarket();
        setCryptoData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch market data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (num: number | undefined): string => {
    if (num === undefined) return 'N/A';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const filteredData = cryptoData.filter(crypto => {
    const cleanName = cleanCryptoCode(crypto.name);
    const cleanCode = cleanCryptoCode(crypto.code);
    const cleanSearchTerm = cleanCryptoCode(searchTerm);
    
    return cleanName.toLowerCase().includes(cleanSearchTerm.toLowerCase()) ||
           cleanCode.toLowerCase().includes(cleanSearchTerm.toLowerCase());
  });

  const columns: TableColumn<CoinData>[] = [
    {
      key: 'rank',
      header: 'Rank',
      render: (item) => <span className="text-base">{item.rank || 'N/A'}</span>
    },
    {
      key: 'name',
      header: 'Name',
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.png64 && (
            <img src={item.png64} alt={item.name} className="w-8 h-8" />
          )}
          <span className="text-base">{cleanCryptoCode(item.name)}</span>
        </div>
      )
    },
    {
      key: 'price',
      header: 'Price ($)',
      render: CellRenderers.price
    },
    {
      key: 'volume',
      header: 'Volume',
      render: (item) => <span className="text-base">{formatNumber(item.volume)}</span>
    },
    {
      key: 'cap',
      header: 'Market Cap',
      render: (item) => <span className="text-base">{formatNumber(item.cap)}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: CellRenderers.marketActions,
      className: 'text-center'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="card bg-base-200/50 shadow-md">
          <div className="card-body">
            <div className="flex justify-center items-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CryptoTable
      data={filteredData}
      columns={columns}
      title="Markets"
      showSearch={true}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
      emptyMessage="No cryptocurrencies found"
    />
  );
};

export default Markets;