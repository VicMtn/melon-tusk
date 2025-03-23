import React, { useState } from 'react';
import TransactionModal from './TransactionModal';
import transactionService from '../services/transactionService';
import { useUser } from '../hooks/useUser';
import { CoinData } from '../types/crypto';
import CryptoActionButton from './CryptoActionButton';

interface BuyCryptoButtonProps {
  cryptoData: Pick<CoinData, 'code' | 'name' | 'rate' | 'png64'>;
  onSuccess?: () => void;
}

const BuyCryptoButton: React.FC<BuyCryptoButtonProps> = ({ cryptoData, onSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, refreshUser } = useUser();

  const handleTransaction = async (amount: number) => {
    await transactionService.buyCrypto(cryptoData.code, amount);
    await refreshUser();
    onSuccess?.();
  };

  return (
    <>
      <CryptoActionButton
        action="buy"
        size="sm"
        onClick={() => setIsModalOpen(true)}
      />

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="buy"
        cryptoData={cryptoData}
        balance={user?.wallet?.balance || 0}
        onSubmit={handleTransaction}
      />
    </>
  );
};

export default BuyCryptoButton; 