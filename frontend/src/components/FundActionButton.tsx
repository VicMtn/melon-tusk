import React from 'react';

interface FundActionButtonProps {
  action: 'deposit' | 'withdraw';
  fullWidth?: boolean;
  onClick?: () => void;
}

const FundActionButton: React.FC<FundActionButtonProps> = ({ 
  action, 
  fullWidth = false, 
  onClick 
}) => {
  const buttonClass = `
    btn 
    ${action === 'deposit' ? 'btn-primary' : 'btn-outline'} 
    ${fullWidth ? 'w-full' : ''} 
    h-10
  `;

  return (
    <button 
      className={buttonClass}
      onClick={onClick}
    >
      {action === 'deposit' ? (
        <>
          <span className="icon-[tabler--plus] size-5 mr-1"></span>
          Deposit
        </>
      ) : (
        <>
          <span className="icon-[tabler--minus] size-5 mr-1"></span>
          Withdraw
        </>
      )}
    </button>
  );
};

export default FundActionButton; 