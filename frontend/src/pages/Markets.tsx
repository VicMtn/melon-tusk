import { useState, useEffect } from 'react';
import CryptoTable, { TableColumn, CellRenderers, BaseCryptoData } from '../components/CryptoTable';

interface CryptoData extends BaseCryptoData {
  rank: number;
  volume: number;
  cap: number;
}

const Markets: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // This will be replaced with your actual API call
    fetch('/coindata.json')
      .then(response => response.json())
      .then(data => setCryptoData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const filteredData = cryptoData.filter(crypto => 
    crypto.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Définition des colonnes pour le tableau des marchés
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