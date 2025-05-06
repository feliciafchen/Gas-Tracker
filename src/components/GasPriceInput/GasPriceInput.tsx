import { useState, useEffect } from 'react';

interface GasPriceInputProps {
  gasPrice: string;
  onGasPriceChange: (price: string) => void;
  onError: (error: string) => void;
}

export function GasPriceInput({ gasPrice, onGasPriceChange, onError }: GasPriceInputProps) {
  useEffect(() => {
    if (gasPrice) {
      validateGasPrice(gasPrice);
    } else {
      onError("");
    }
  }, [gasPrice]);

  const validateGasPrice = (price: string) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || !price) {
      onError("Please enter a valid gas price");
      return false;
    }
    if (numPrice < 0) {
      onError("Gas price cannot be negative");
      return false;
    }
    onError("");
    return true;
  };

  const handleGasPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onGasPriceChange(value);
  };

  return (
    <div className="gas-price-input">
      <label htmlFor="gasPrice">Gas Price (USD/gal)</label>
      <input
        type="number"
        id="gasPrice"
        value={gasPrice}
        onChange={handleGasPriceChange}
        step="0.01"
        min="0"
        placeholder="e.g., 4.50"
      />
    </div>
  );
} 