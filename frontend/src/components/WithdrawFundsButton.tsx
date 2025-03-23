import React, { useState } from 'react';
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
  const { user, refreshUser } = useUser();

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
        onClick={() => setIsModalOpen(true)}
      />

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="withdraw"
        balance={user?.wallet?.balance || 0}
        onSubmit={handleTransaction}
      />
    </>
  );
};

export default WithdrawFundsButton; 