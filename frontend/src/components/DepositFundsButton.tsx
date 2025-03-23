import React, { useState } from 'react';
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
  const { user, refreshUser } = useUser();

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
        onClick={() => setIsModalOpen(true)}
      />

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="deposit"
        balance={user?.wallet?.balance || 0}
        onSubmit={handleTransaction}
      />
    </>
  );
};

export default DepositFundsButton; 