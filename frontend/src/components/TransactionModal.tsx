import React, { useState } from 'react';
import { CoinData } from '../types/crypto';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'buy' | 'sell' | 'deposit' | 'withdraw';
  cryptoData?: Pick<CoinData, 'code' | 'name' | 'rate' | 'png64'>;
  balance?: number;
  onSubmit: (amount: number, total: number) => Promise<void>;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  type,
  cryptoData,
  balance = 0,
  onSubmit
}) => {
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFiatOperation = type === 'deposit' || type === 'withdraw';
  const total = isFiatOperation ? Number(amount) : (cryptoData ? Number(amount) * cryptoData.rate : 0);
  const isValidAmount = Number(amount) > 0 && !isNaN(Number(amount));
  const hasEnoughBalance = (type === 'sell' || type === 'withdraw') ? Number(amount) <= balance : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAmount || !hasEnoughBalance || (!cryptoData && !isFiatOperation)) return;

    setError(null);
    setIsLoading(true);

    try {
      await onSubmit(Number(amount), total);
      setAmount('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'buy':
        return 'arrow-down';
      case 'sell':
        return 'arrow-up';
      case 'deposit':
        return 'wallet';
      case 'withdraw':
        return 'wallet';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'buy':
        return 'text-success';
      case 'sell':
        return 'text-error';
      case 'deposit':
        return 'text-success';
      case 'withdraw':
        return 'text-error';
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'buy':
        return 'btn-success';
      case 'sell':
        return 'btn-error';
      case 'deposit':
        return 'btn-primary';
      case 'withdraw':
        return 'btn-outline';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'buy':
        return `Buy ${cryptoData?.name}`;
      case 'sell':
        return `Sell ${cryptoData?.name}`;
      case 'deposit':
        return 'Add Funds';
      case 'withdraw':
        return 'Withdraw Funds';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-50">
        <button
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
          onClick={onClose}
        >
          <span className="icon-[tabler--x] size-5"></span>
        </button>
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <span className={`icon-[tabler--${getIcon()}] size-16 ${getColor()}`}></span>
            {!isFiatOperation && cryptoData && (
              <div className="flex items-center mt-2">
                {cryptoData.png64 && (
                  <img
                    src={cryptoData.png64}
                    alt={cryptoData.name}
                    className="w-6 h-6 mr-2 rounded-full"
                  />
                )}
                <h3 className="text-lg font-bold">{cryptoData.name}</h3>
              </div>
            )}
            <h2 className="text-2xl font-bold mt-2">{getTitle()}</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 rounded-lg p-3 mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount {isFiatOperation ? '(USD)' : `(${cryptoData?.code})`}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0.00"
                    required
                  />
                  {(type === 'sell' || type === 'withdraw') && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded"
                      onClick={() => setAmount(balance.toString())}
                    >
                      MAX
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available Balance</span>
                  <span className="font-medium">
                    {isFiatOperation 
                      ? `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
                      : `${balance.toLocaleString('en-US', { minimumFractionDigits: 8 })} ${cryptoData?.code}`}
                  </span>
                </div>
                {!isFiatOperation && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total {type === 'buy' ? 'Cost' : 'Received'}</span>
                    <span className="font-medium">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
                  type === 'buy' ? 'bg-green-600 hover:bg-green-700' :
                  type === 'sell' ? 'bg-red-600 hover:bg-red-700' :
                  type === 'deposit' ? 'bg-blue-600 hover:bg-blue-700' :
                  'bg-red-500 hover:bg-red-600'
                } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                disabled={isLoading || !isValidAmount || !hasEnoughBalance}
              >
                {!isLoading && (
                  <span className={`icon-[tabler--${getIcon()}] size-5`}></span>
                )}
                {isLoading
                  ? 'Processing...'
                  : !isValidAmount
                  ? 'Enter an amount'
                  : !hasEnoughBalance
                  ? 'Insufficient balance'
                  : type === 'deposit'
                  ? 'Add Funds'
                  : type === 'withdraw'
                  ? 'Withdraw Funds'
                  : `${type === 'buy' ? 'Buy' : 'Sell'} ${cryptoData?.code}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal; 