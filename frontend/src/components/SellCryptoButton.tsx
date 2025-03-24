import React, { useState } from 'react';
import TransactionModal from './TransactionModal';
import transactionService from '../services/transactionService';
import { useUser } from '../hooks/useUser';
import { CoinData } from '../types/crypto';
import CryptoActionButton from './CryptoActionButton';
import { Asset } from '../types/wallet';

interface SellCryptoButtonProps {
  cryptoData: Pick<CoinData, 'code' | 'name' | 'rate' | 'png64'>;
  asset?: Asset;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onSuccess?: () => void;
}

const SellCryptoButton: React.FC<SellCryptoButtonProps> = ({ 
  cryptoData, 
  asset, 
  fullWidth = false,
  size = 'sm',
  onSuccess 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, refreshUser } = useUser();

  // Get the user's current amount of this cryptocurrency
  const assetAmount = asset?.amount || 
    user?.wallet?.assets?.find(a => a.code === cryptoData.code)?.amount || 0;

  const handleTransaction = async (amount: number) => {
    await transactionService.sellCrypto(cryptoData.code, amount);
    await refreshUser();
    if (onSuccess) onSuccess();
  };

  return (
    <>
      <CryptoActionButton
        action="sell"
        size={size}
        fullWidth={fullWidth}
        onClick={() => setIsModalOpen(true)}
      />

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="sell"
        cryptoData={cryptoData}
        balance={assetAmount}
        onSubmit={handleTransaction}
      />
    </>
  );
};

export default SellCryptoButton; 