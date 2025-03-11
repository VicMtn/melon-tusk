import React, { useState } from 'react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'buy' | 'sell' | 'deposit' | 'withdraw';
  cryptoData?: {
    code: string;
    name: string;
    price: number;
    icon?: string;
  };
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
  const total = isFiatOperation ? Number(amount) : (cryptoData ? Number(amount) * cryptoData.price : 0);
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
    <>
      <div className="fixed inset-0 bg-black/50 z-[1000]" onClick={onClose} />
      
      <div className="fixed inset-0 flex items-center justify-center z-[1001] pointer-events-none">
        <div className="bg-white rounded-lg p-6 w-full max-w-md relative pointer-events-auto">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <span className="icon-[tabler--x] size-5"></span>
          </button>

          <div className="text-center mb-6">
            <span className={`icon-[tabler--${getIcon()}] size-16 ${getColor()}`}></span>
            <h2 className="text-2xl font-bold">
              {getTitle()}
            </h2>
            {!isFiatOperation && (
              <p className="text-gray-600">
                Current price: ${cryptoData?.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error/10 text-error rounded-lg p-3 mb-4 text-sm">
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
                    className="input input-bordered w-full pr-24"
                    placeholder="0.00"
                    required
                  />
                  {(type === 'sell' || type === 'withdraw') && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-xs"
                      onClick={() => setAmount(balance.toString())}
                    >
                      MAX
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-base-200 rounded-lg p-4 space-y-2">
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
                className={`btn w-full ${getButtonClass()} ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || !isValidAmount || !hasEnoughBalance}
              >
                {!isLoading && (
                  <span className={`icon-[tabler--${getIcon()}] size-5 mr-2`}></span>
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
    </>
  );
};

export default TransactionModal; 