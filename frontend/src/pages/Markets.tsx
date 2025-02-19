import { useState, useEffect } from 'react';

interface CryptoData {
  rank: number;
  name: string;
  rate: number;
  volume: number;
  cap: number;
}

const Markets: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);

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

  return (
    <>
      <div className="text-xl font-medium mb-2">
        Markets
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
              {cryptoData.map((crypto) => (
                <tr key={crypto.name}>
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
    </>
  );
};

export default Markets;