import React from 'react';
import CryptoActionButton from './CryptoActionButton';

// Generic type for crypto data
export interface BaseCryptoData {
  code: string;
  name: string;
  rate: number;
  png64?: string;
}

// Type for table columns
export interface TableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface CryptoTableProps<T extends BaseCryptoData> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  showSearch?: boolean;
  onSearch?: (term: string) => void;
  searchTerm?: string;
  emptyMessage?: string;
}

function CryptoTable<T extends BaseCryptoData>({
  data,
  columns,
  title,
  showSearch = false,
  onSearch,
  searchTerm = '',
  emptyMessage = 'No data available'
}: CryptoTableProps<T>) {
  // Format number
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {title && (
        <>
          <div className="text-xl font-medium">{title}</div>
          <div className="divider m-0 h-1"></div>
        </>
      )}
      
      {showSearch && onSearch && (
        <div className="w-full max-w-md">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="icon-[tabler--search] size-5 text-gray-400"></span>
            </span>
            <input
              type="text"
              className="bg-white w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-base-content/25"
              placeholder="Search by name or code..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      )}
      
      <div className="border-base-content/25 w-full rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <table className="table rounded w-full">
            <thead>
              <tr className="uppercase text-xs text-gray-500 bg-gray-50">
                {columns.map((column) => (
                  <th key={column.key} className={`font-medium ${column.className || ''}`}>
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.code} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={`${item.code}-${column.key}`} className={column.className || ''}>
                        {column.render(item)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const CellRenderers = {
  // Cellule pour le rang
  rank: (item: { rank: number }) => (
    <span className="text-nowrap">#{item.rank}</span>
  ),
  
  nameWithImage: (item: BaseCryptoData & { png64?: string }) => (
    <div className="flex items-center gap-3">
      {item.png64 && (
        <img 
          src={item.png64}
          alt={item.name}
          className="w-8 h-8 rounded-full"
        />
      )}
      <div>
        <div className="font-medium">{item.code}</div>
        <div className="text-sm text-gray-500">{item.name}</div>
      </div>
    </div>
  ),
  
  price: (item: BaseCryptoData) => (
    <span>${item.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
  ),
  
  percentChange: (item: { delta: { day: number } }) => {
    const isPositive = item.delta.day >= 0;
    return (
      <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
        {isPositive ? '+' : ''}{item.delta.day.toFixed(2)}%
      </span>
    );
  },
  
  buySellActions: () => (
    <div className="flex justify-center gap-2">
      <CryptoActionButton action="buy" size="sm" />
      <CryptoActionButton action="sell" size="sm" />
    </div>
  ),
  
  marketActions: () => (
    <div className="flex justify-center gap-2">
      <CryptoActionButton action="watchlist" size="sm" />
      <CryptoActionButton action="buy" size="sm" />
      <CryptoActionButton action="sell" size="sm" />
    </div>
  )
};

export default CryptoTable; 