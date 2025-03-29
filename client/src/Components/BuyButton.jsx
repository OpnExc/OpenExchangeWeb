import React from 'react';
import { useContact } from '../contexts/ContactContext';

const BuyButton = ({ item, onBuyClick }) => {
  const { hasValidContact, requestContactUpdate, isChecking } = useContact();

  const handleBuyClick = (e) => {
    e.stopPropagation();
    
    if (!hasValidContact && !isChecking) {
      // Request contact update before proceeding
      requestContactUpdate(() => {
        // This will be called after successful update
        onBuyClick(item);
      });
    } else {
      // Contact already valid, proceed directly
      onBuyClick(item);
    }
  };

  return (
    <button 
      className="flex-1 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-none text-sm font-medium transition-colors duration-200"
      onClick={handleBuyClick}
    >
      {item.Type === 'sell' ? 'Buy Now' : 'Exchange'}
    </button>
  );
};

export default BuyButton;