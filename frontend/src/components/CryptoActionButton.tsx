import React from 'react';

interface CryptoActionButtonProps {
  action: 'buy' | 'sell' | 'watchlist';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const CryptoActionButton: React.FC<CryptoActionButtonProps> = ({ 
  action, 
  fullWidth = false, 
  size = 'md',
  onClick 
}) => {
  const isSquare = size === 'sm';
  const buttonClass = `
    btn 
    ${action === 'buy' ? 'btn-success' : 'btn-error'} 
    ${fullWidth ? 'w-full' : ''} 
    ${size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''}
    ${isSquare ? 'btn-square' : ''}
  `;

  return (
    <button 
      className={buttonClass}
      onClick={onClick}
    >
      {action === 'buy' ? (
        <>
          <span className={`icon-[tabler--${isSquare ? 'square-arrow-down' : 'square-arrow-down'}] ${isSquare ? 'size-4' : 'size-5 mr-2'}`}></span>
          {!isSquare && 'Buy'}
        </>
      ) : (
        <>
          <span className={`icon-[tabler--${isSquare ? 'square-arrow-up' : 'square-arrow-up'}] ${isSquare ? 'size-4' : 'size-5 mr-2'}`}></span>
          {!isSquare && 'Sell'}
        </>
      )}
    </button>
  );
};

export default CryptoActionButton; 