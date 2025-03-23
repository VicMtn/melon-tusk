import React, { useState, useEffect } from 'react';
import TransactionModal from './TransactionModal';
import transactionService from '../services/transactionService';
import { useUser } from '../hooks/useUser';
import FundActionButton from './FundActionButton';

interface WithdrawFundsButtonProps {
  fullWidth?: boolean;
  onSuccess?: () => void;
}

const WithdrawFundsButton: React.FC<WithdrawFundsButtonProps> = ({ fullWidth = false, onSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const { user, refreshUser } = useUser();

  useEffect(() => {
    if (user && user.wallet) {
      setCurrentBalance(user.wallet.balance);
    }
  }, [user, isModalOpen]);

  const handleOpenModal = async () => {
    await refreshUser();
    setIsModalOpen(true);
  };

  const handleTransaction = async (amount: number) => {
    await transactionService.handleWalletOperation('withdraw', amount);
    await refreshUser();
    if (onSuccess) onSuccess();
  };

  return (
    <>
      <FundActionButton
        action="withdraw"
        fullWidth={fullWidth}
        onClick={handleOpenModal}
      />

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="withdraw"
        balance={currentBalance}
        onSubmit={handleTransaction}
      />
    </>
  );
};

export default WithdrawFundsButton; 