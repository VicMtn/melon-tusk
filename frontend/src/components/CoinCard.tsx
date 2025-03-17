import React from 'react';
import { cleanCryptoCode, formatCurrency, formatPercentage } from '../utils/formatters';
import { CryptoData } from '../types/crypto';

interface CoinCardProps {
  title: string;
  coin: CryptoData;
}

const CoinCard: React.FC<CoinCardProps> = ({ title, coin }) => {
  // Nettoyer le code en retirant les underscores
  const cleanedCode = cleanCryptoCode(coin.code);
  
  return (
    <div className="card w-full">
      <div className="card-body p-3 sm:p-4">
        <div className="text-base-content/50 mb-2">
          {title}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <img
                src={coin.png64}
                alt={coin.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = `https://cryptoicons.org/api/icon/${cleanedCode.toLowerCase()}/64`;
                }}
              />
              <div className="flex flex-col">
                <div className="card-title text-base sm:text-lg leading-none">{cleanedCode}</div>
                <div className="text-base-content/50 text-xs sm:text-sm">{coin.name}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-base-content/50 text-xs sm:text-sm">Rate</div>
              <div className="font-semibold text-right text-base sm:text-lg truncate max-w-[160px]">
                {formatCurrency(coin.rate)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex flex-col">
              <div className="text-base-content/50 text-xs">24h</div>
              <div className={`${coin.delta?.day && coin.delta.day >= 1 ? 'text-success' : 'text-error'}`}>
                {formatPercentage(coin.delta?.day || 0)}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-base-content/50 text-xs">7d</div>
              <div className={`${coin.delta?.week && coin.delta.week >= 1 ? 'text-success' : 'text-error'}`}>
                {formatPercentage(coin.delta?.week || 0)}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-base-content/50 text-xs">1h</div>
              <div className={`${coin.delta?.hour && coin.delta.hour >= 1 ? 'text-success' : 'text-error'}`}>
                {formatPercentage(coin.delta?.hour || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CoinCard };