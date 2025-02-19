import { useState, useEffect } from 'react';

interface CryptoData {
  rank: number;
  name: string;
  code: string;
  rate: number;
  volume: number;
  cap: number;
}

const Markets: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // This will be replaced with your actual API call
    fetch('/data.json')
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
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="text-xl font-medium">
          Markets
        </div>
        <div className="divider m-0 h-1"></div>
        <div className="w-full max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="icon-[tabler--search] size-5 text-gray-400"></span>
            </span>
            <input
              type="text"
              className=" bg-white w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-base-content/25"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="border-base-content/25 w-full rounded-lg border bg-white">
          <div className="overflow-x-auto">
            <table className="table rounded">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>

                  <th>Price ($)</th>
                  <th>Volume</th>
                  <th>Market Cap</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((crypto) => (
                  <tr key={crypto.code}>
                    <td className="text-nowrap">#{crypto.rank}</td>
                    <td>{crypto.name}</td>

                    <td>{formatNumber(crypto.rate)}</td>
                    <td><span className="text-base">{formatNumber(crypto.volume)}</span></td>
                    <td className="text-base">{formatNumber(crypto.cap)}</td>
                    <td className="text-center gap-2">
                      <button className="btn btn-circle btn-text btn-sm" aria-label="Action button">
                        <span className="icon-[tabler--star] size-5"></span>
                      </button>
                      <button className="btn btn-circle btn-success btn-text btn-sm" aria-label="Action button">
                        <span className="icon-[tabler--square-arrow-down] size-5"></span>
                      </button>
                      <button className="btn btn-circle btn-error btn-text btn-sm" aria-label="Action button">
                        <span className="icon-[tabler--square-arrow-up] size-5"></span>
                      </button>
                      <button className="btn btn-circle btn-text btn-sm" aria-label="Action button">
                        <span className="icon-[tabler--dots-vertical] size-5"></span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Markets;