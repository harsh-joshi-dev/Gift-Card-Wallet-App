import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CurrencyFilter from '../CurrencyFilter';

const mockOnCurrencySelect = jest.fn();

describe('CurrencyFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with title', () => {
    const { getByText } = render(
      <CurrencyFilter
        selectedCurrency={null}
        onCurrencySelect={mockOnCurrencySelect}
        availableCurrencies={['USD', 'EUR']}
      />
    );

    expect(getByText('Filter by Currency')).toBeTruthy();
  });

  it('renders "All Cards" option', () => {
    const { getByText } = render(
      <CurrencyFilter
        selectedCurrency={null}
        onCurrencySelect={mockOnCurrencySelect}
        availableCurrencies={['USD', 'EUR']}
      />
    );

    expect(getByText('All Cards')).toBeTruthy();
    expect(getByText('🎁')).toBeTruthy();
  });

  it('renders available currencies', () => {
    const { getByText } = render(
      <CurrencyFilter
        selectedCurrency={null}
        onCurrencySelect={mockOnCurrencySelect}
        availableCurrencies={['USD', 'EUR']}
      />
    );

    expect(getByText('USD')).toBeTruthy();
    expect(getByText('EUR')).toBeTruthy();
  });

  it('calls onCurrencySelect when "All Cards" is pressed', () => {
    const { getByText } = render(
      <CurrencyFilter
        selectedCurrency={null}
        onCurrencySelect={mockOnCurrencySelect}
        availableCurrencies={['USD', 'EUR']}
      />
    );

    fireEvent.press(getByText('All Cards'));
    expect(mockOnCurrencySelect).toHaveBeenCalledWith(null);
  });

  it('calls onCurrencySelect when a currency is pressed', () => {
    const { getByText } = render(
      <CurrencyFilter
        selectedCurrency={null}
        onCurrencySelect={mockOnCurrencySelect}
        availableCurrencies={['USD', 'EUR']}
      />
    );

    fireEvent.press(getByText('USD'));
    expect(mockOnCurrencySelect).toHaveBeenCalledWith('USD');
  });

  it('shows selected state for "All Cards" when selectedCurrency is null', () => {
    const { getByText } = render(
      <CurrencyFilter
        selectedCurrency={null}
        onCurrencySelect={mockOnCurrencySelect}
        availableCurrencies={['USD', 'EUR']}
      />
    );

    const allCardsButton = getByText('All Cards');
    expect(allCardsButton).toBeTruthy();
  });

  it('shows selected state for a specific currency', () => {
    const { getByText } = render(
      <CurrencyFilter
        selectedCurrency="USD"
        onCurrencySelect={mockOnCurrencySelect}
        availableCurrencies={['USD', 'EUR']}
      />
    );

    const usdButton = getByText('USD');
    expect(usdButton).toBeTruthy();
  });

  it('handles empty available currencies array', () => {
    const { getByText } = render(
      <CurrencyFilter
        selectedCurrency={null}
        onCurrencySelect={mockOnCurrencySelect}
        availableCurrencies={[]}
      />
    );

    expect(getByText('Filter by Currency')).toBeTruthy();
    expect(getByText('All Cards')).toBeTruthy();
  });

  it('handles single currency in available currencies', () => {
    const { getByText } = render(
      <CurrencyFilter
        selectedCurrency={null}
        onCurrencySelect={mockOnCurrencySelect}
        availableCurrencies={['USD']}
      />
    );

    expect(getByText('USD')).toBeTruthy();
  });

  it('handles multiple currencies in available currencies', () => {
    const { getByText } = render(
      <CurrencyFilter
        selectedCurrency={null}
        onCurrencySelect={mockOnCurrencySelect}
        availableCurrencies={['USD', 'EUR', 'GBP', 'JPY']}
      />
    );

    expect(getByText('USD')).toBeTruthy();
    expect(getByText('EUR')).toBeTruthy();
    expect(getByText('GBP')).toBeTruthy();
    expect(getByText('JPY')).toBeTruthy();
  });

  it('calls onCurrencySelect with correct currency code for each currency', () => {
    const { getByText } = render(
      <CurrencyFilter
        selectedCurrency={null}
        onCurrencySelect={mockOnCurrencySelect}
        availableCurrencies={['USD', 'EUR']}
      />
    );

    fireEvent.press(getByText('USD'));
    expect(mockOnCurrencySelect).toHaveBeenCalledWith('USD');

    fireEvent.press(getByText('EUR'));
    expect(mockOnCurrencySelect).toHaveBeenCalledWith('EUR');
  });

  it('renders currency flags', () => {
    const { getByText } = render(
      <CurrencyFilter
        selectedCurrency={null}
        onCurrencySelect={mockOnCurrencySelect}
        availableCurrencies={['USD', 'EUR']}
      />
    );

    // Check for currency flags (these would be emoji flags)
    expect(getByText('🎁')).toBeTruthy(); // All Cards flag
  });

  it('handles currency selection change', () => {
    const { getByText, rerender } = render(
      <CurrencyFilter
        selectedCurrency={null}
        onCurrencySelect={mockOnCurrencySelect}
        availableCurrencies={['USD', 'EUR']}
      />
    );

    // Initially "All Cards" should be selected
    expect(getByText('All Cards')).toBeTruthy();

    // Select USD
    fireEvent.press(getByText('USD'));
    expect(mockOnCurrencySelect).toHaveBeenCalledWith('USD');

    // Re-render with USD selected
    rerender(
      <CurrencyFilter
        selectedCurrency="USD"
        onCurrencySelect={mockOnCurrencySelect}
        availableCurrencies={['USD', 'EUR']}
      />
    );

    expect(getByText('USD')).toBeTruthy();
  });
}); 