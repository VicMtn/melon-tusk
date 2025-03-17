import React, { useState } from 'react';
import TransactionModal from './TransactionModal';
import transactionService from '../services/transactionService';
import { useUser } from '../hooks/useUser'; // Assurez-vous d'avoir ce hook pour gérer l'état de l'utilisateur
import { CryptoData } from '../types/crypto';

interface BuyCryptoButtonProps {
  cryptoData: Pick<CryptoData, 'code' | 'name' | 'rate' | 'png64'>;
  onSuccess?: () => void;
}

const BuyCryptoButton: React.FC<BuyCryptoButtonProps> = ({ cryptoData, onSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, refreshUser } = useUser();

  const handleTransaction = async (amount: number, total: number) => {
    await transactionService.buyCrypto(cryptoData.code, amount);
    await refreshUser();
    onSuccess?.();
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-success btn-sm"
      >
        <span className="icon-[tabler--arrow-down] size-4 mr-1"></span>
        Buy
      </button>

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