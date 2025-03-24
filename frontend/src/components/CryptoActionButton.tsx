import React from 'react';
import { Icon } from '@iconify/react';

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
    ${action === 'buy' ? 'btn-success' : action === 'sell' ? 'btn-error' : 'btn-text'} 
    ${fullWidth ? 'w-full' : ''} 
    ${size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''}
    ${isSquare ? 'btn-square' : ''}
  `;

  const getIcon = () => {
    switch (action) {
      case 'buy':
        return 'arrow-down';
      case 'sell':
        return 'arrow-up';
      case 'watchlist':
        return 'star';
      default:
        return 'arrow-down';
    }
  };

  const iconSize = isSquare ? 'size-4' : 'size-5';
  const iconMargin = isSquare ? '' : 'mr-2';

  return (
    <button 
      className={buttonClass}
      onClick={onClick}
    >
      <Icon icon={`tabler:${getIcon()}`} className={`${iconSize} ${iconMargin}`} />
      {!isSquare && action.charAt(0).toUpperCase() + action.slice(1)}
    </button>
  );
};

export default CryptoActionButton; 