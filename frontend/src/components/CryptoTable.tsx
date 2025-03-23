import React from 'react';
import CryptoActionButton from './CryptoActionButton';
import { CoinData } from '../types/crypto';
import { Transaction } from '../types/transaction';
import { CryptoMiddleware } from '../middleware/cryptoMiddleware';

// Type for table columns
export interface TableColumn<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
}

interface CryptoTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  showSearch?: boolean;
  onSearch?: (term: string) => void;
  searchTerm?: string;
  emptyMessage?: string;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
}

function CryptoTable<T>({
  data,
  columns,
  title,
  showSearch = false,
  onSearch,
  searchTerm = '',
  emptyMessage = 'No data available',
  pageSize,
  currentPage = 1,
  onPageChange,
  totalItems
}: CryptoTableProps<T>) {

  const totalPages = pageSize && pageSize > 0 ? Math.ceil((totalItems || data.length) / pageSize) : 0;
  const showPagination = totalPages > 1 && pageSize && pageSize > 0;

  // Paginate data locally
  const paginatedData = React.useMemo(() => {
    if (!pageSize || pageSize <= 0) return data;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, currentPage, pageSize]);

  const renderPagination = () => {
    if (!showPagination) return null;

    return (
      <div className="flex justify-center items-center gap-2">
        <button
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="icon-[tabler--chevron-left] size-5"></span>
        </button>
        
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="icon-[tabler--chevron-right] size-5"></span>
        </button>
      </div>
    );
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
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={`${index}-${column.key}`} className={column.className || ''}>
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
      {renderPagination()}
    </div>
  );
}

export const CellRenderers = {
  // Cellule pour le rang
  rank: (item: { rank: number }) => (
    <span className="text-nowrap">#{item.rank}</span>
  ),
  
  nameWithImage: (item: CryptoData) => (
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
  
  price: (item: CryptoData) => (
    <span>${item.rate?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
  ),
  
  percentChange: (item: { delta: { day: number } }) => {
    const percentage = CryptoMiddleware.deltaToPercentage(item.delta.day);
    const isPositive = percentage>= 0;
    return (
      <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
        {isPositive ? '+' : ''}{percentage.toFixed(2)}%
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
  ),

  // Renderers pour l'historique des transactions
  transactionDate: (transaction: Transaction) => (
    <span className="text-gray-600">
      {new Date(transaction.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}
    </span>
  ),

  transactionType: (transaction: Transaction) => {
    const typeColors = {
      buy: 'text-green-600',
      sell: 'text-red-600',
      deposit: 'text-blue-600',
      withdraw: 'text-orange-600'
    };
    return (
      <span className={`font-medium ${typeColors[transaction.type]} capitalize`}>
        {transaction.type}
      </span>
    );
  },

  transactionAsset: (transaction: Transaction) => (
    <span className="font-medium">
      {transaction.code || 'USD'}
    </span>
  ),

  transactionAmount: (transaction: Transaction) => (
    <span>
      {transaction.amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8
      })}
    </span>
  ),

  transactionRate: (transaction: Transaction) => (
    transaction.rate ? (
      <span>
        ${transaction.rate.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </span>
    ) : (
      <span>-</span>
    )
  ),

  transactionTotal: (transaction: Transaction) => (
    <span className="font-medium">
      ${transaction.total.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}
    </span>
  )
};

export default CryptoTable; 