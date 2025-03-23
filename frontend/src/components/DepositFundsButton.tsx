import React, { useState, useEffect } from 'react';
import TransactionModal from './TransactionModal';
import transactionService from '../services/transactionService';
import { useUser } from '../hooks/useUser';
import FundActionButton from './FundActionButton';

interface DepositFundsButtonProps {
  fullWidth?: boolean;
  onSuccess?: () => void;
}

const DepositFundsButton: React.FC<DepositFundsButtonProps> = ({ fullWidth = false, onSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const { user, refreshUser } = useUser();

  // Mettre à jour le solde à chaque fois que l'utilisateur change ou quand la modal s'ouvre
  useEffect(() => {
    if (user && user.wallet) {
      setCurrentBalance(user.wallet.balance);
    }
  }, [user, isModalOpen]);

  const handleOpenModal = async () => {
    // Forcer l'actualisation des données utilisateur pour avoir le dernier solde
    await refreshUser();
    setIsModalOpen(true);
  };

  const handleTransaction = async (amount: number) => {
    await transactionService.handleWalletOperation('deposit', amount);
    await refreshUser();
    if (onSuccess) onSuccess();
  };

  return (
    <>
      <FundActionButton
        action="deposit"
        fullWidth={fullWidth}
        onClick={handleOpenModal}
      />

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="deposit"
        balance={currentBalance}
        onSubmit={handleTransaction}
      />
    </>
  );
};

export default DepositFundsButton; 