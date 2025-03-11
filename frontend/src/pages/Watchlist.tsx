import { useState, useEffect } from 'react';
import CryptoTable, { TableColumn, CellRenderers, BaseCryptoData } from '../components/CryptoTable';

interface CryptoData extends BaseCryptoData {
  rank: number;
  volume: number;
  cap: number;
  delta: {
    hour: number;
    day: number;
    week: number;
    month: number;
  };
}

const Watchlist: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlistData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Fetch user's watchlist
        const userWatchlist = await fetch('/api/user/watchlist')
          .then(res => res.json())
          .catch(() => ({ cryptoIds: [] }));

        // 2. Fetch all crypto data
        const allCryptoData = await fetch('/coindata.json')
          .then(res => res.json())
          .catch(() => []);

        // 3. Filter crypto data to only include watched items
        const watchlistData = allCryptoData.filter((crypto: BaseCryptoData) => 
          crypto.code && userWatchlist.cryptoIds.includes(crypto.code)
        );

        setCryptoData(watchlistData);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlistData();
  }, []);

  const handleRemoveFromWatchlist = async (cryptoId: string) => {
    try {
      await fetch(`/api/user/watchlist/${cryptoId}`, {
        method: 'DELETE'
      });
      setCryptoData(prev => prev.filter(crypto => crypto.code !== cryptoId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const columns: TableColumn<CryptoData>[] = [
    {
      key: 'rank',
      header: 'Rank',
      render: CellRenderers.rank
    },
    {
      key: 'name',
      header: 'Name',
      render: CellRenderers.nameWithImage
    },
    {
      key: 'price',
      header: 'Price ($)',
      render: CellRenderers.price
    },
    {
      key: 'volume',
      header: 'Volume',
      render: (item) => <span>${item.volume.toLocaleString()}</span>
    },
    {
      key: 'cap',
      header: 'Market Cap',
      render: (item) => <span>${item.cap.toLocaleString()}</span>
    },
    {
      key: 'change',
      header: '24h',
      render: CellRenderers.percentChange
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex justify-center gap-2">
          <button
            className="btn btn-xs btn-ghost text-error"
            onClick={() => item.code && handleRemoveFromWatchlist(item.code)}
            title="Remove from Watchlist"
          >
            <span className="icon-[tabler--star-off] size-4"></span>
          </button>
        </div>
      ),
      className: 'text-center'
    }
  ];

  return (
    <CryptoTable
      data={cryptoData}
      columns={columns}
      title="Watchlist"
      showSearch={false}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
      emptyMessage={
        isLoading 
          ? "Loading your watchlist..." 
          : "Your watchlist is empty. Add cryptocurrencies from the Markets page!"
      }
    />
  );
};

export default Watchlist;