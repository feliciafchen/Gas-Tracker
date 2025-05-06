import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GasPriceInput } from './GasPriceInput';

describe('GasPriceInput', () => {
  const mockOnGasPriceChange = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with initial gas price', () => {
    render(
      <GasPriceInput
        gasPrice="4.50"
        onGasPriceChange={mockOnGasPriceChange}
        onError={mockOnError}
      />
    );

    const input = screen.getByLabelText(/gas price/i);
    expect(input).toHaveValue(4.50);
  });

  it('calls onGasPriceChange when input value changes', async () => {
    render(
      <GasPriceInput
        gasPrice=""
        onGasPriceChange={mockOnGasPriceChange}
        onError={mockOnError}
      />
    );

    const input = screen.getByLabelText(/gas price/i);
    await userEvent.type(input, '3.75');

    expect(mockOnGasPriceChange).toHaveBeenCalledWith('3.75');
  });

  it('does not allow non-numeric input', async () => {
    render(
      <GasPriceInput
        gasPrice=""
        onGasPriceChange={mockOnGasPriceChange}
        onError={mockOnError}
      />
    );

    const input = screen.getByLabelText(/gas price/i);
    await userEvent.type(input, 'abc');

    expect(input).toHaveValue(null);
    expect(mockOnError).toHaveBeenCalledWith('');
  });

  it('shows error for negative input', async () => {
    render(
      <GasPriceInput
        gasPrice=""
        onGasPriceChange={mockOnGasPriceChange}
        onError={mockOnError}
      />
    );

    const input = screen.getByLabelText(/gas price/i);
    await userEvent.type(input, '-1');

    expect(mockOnError).not.toHaveBeenCalledWith();
  });

  it('clears error when input is cleared', async () => {
    render(
      <GasPriceInput
        gasPrice=""
        onGasPriceChange={mockOnGasPriceChange}
        onError={mockOnError}
      />
    );

    const input = screen.getByLabelText(/gas price/i);
    await userEvent.type(input, 'abc');
    await userEvent.clear(input);

    expect(mockOnError).toHaveBeenCalledWith('');
  });
}); 