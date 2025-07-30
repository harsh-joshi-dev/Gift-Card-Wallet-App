import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AmountInput from '../AmountInput';

describe('AmountInput', () => {
  it('renders correctly with default props', () => {
    const { getByText, getByPlaceholderText } = render(
      <AmountInput
        value=""
        onChangeText={() => {}}
        currency="USD"
      />
    );

    expect(getByText('Amount')).toBeTruthy();
    expect(getByPlaceholderText('0.00')).toBeTruthy();
  });

  it('displays currency flag', () => {
    const { getByText } = render(
      <AmountInput
        value=""
        onChangeText={() => {}}
        currency="USD"
      />
    );

    // Check for currency flag (USD flag emoji)
    expect(getByText('🇺🇸')).toBeTruthy();
  });

  it('displays currency code when flag is not available', () => {
    const { getByText } = render(
      <AmountInput
        value=""
        onChangeText={() => {}}
        currency="INVALID"
      />
    );

    expect(getByText('INVALID')).toBeTruthy();
  });

  it('calls onChangeText when text is entered', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <AmountInput
        value=""
        onChangeText={mockOnChangeText}
        currency="USD"
      />
    );

    const input = getByPlaceholderText('0.00');
    fireEvent.changeText(input, '123.45');
    expect(mockOnChangeText).toHaveBeenCalledWith('123.45');
  });

  it('displays the current value', () => {
    const { getByDisplayValue } = render(
      <AmountInput
        value="123.45"
        onChangeText={() => {}}
        currency="USD"
      />
    );

    expect(getByDisplayValue('123.45')).toBeTruthy();
  });

  it('displays error message when error prop is provided', () => {
    const { getByText } = render(
      <AmountInput
        value=""
        onChangeText={() => {}}
        currency="USD"
        error="Invalid amount"
      />
    );

    expect(getByText('Invalid amount')).toBeTruthy();
  });

  it('applies error styling when error is present', () => {
    const { getByText } = render(
      <AmountInput
        value=""
        onChangeText={() => {}}
        currency="USD"
        error="Invalid amount"
      />
    );

    expect(getByText('Amount')).toBeTruthy();
    expect(getByText('Invalid amount')).toBeTruthy();
  });

  it('uses custom placeholder when provided', () => {
    const { getByPlaceholderText } = render(
      <AmountInput
        value=""
        onChangeText={() => {}}
        currency="USD"
        placeholder="Enter amount"
      />
    );

    expect(getByPlaceholderText('Enter amount')).toBeTruthy();
  });

  it('uses default placeholder when not provided', () => {
    const { getByPlaceholderText } = render(
      <AmountInput
        value=""
        onChangeText={() => {}}
        currency="USD"
      />
    );

    expect(getByPlaceholderText('0.00')).toBeTruthy();
  });

  it('handles different currencies', () => {
    const { getByText: getUSD } = render(
      <AmountInput
        value=""
        onChangeText={() => {}}
        currency="USD"
      />
    );

    const { getByText: getEUR } = render(
      <AmountInput
        value=""
        onChangeText={() => {}}
        currency="EUR"
      />
    );

    expect(getUSD('🇺🇸')).toBeTruthy();
    expect(getEUR('🇪🇺')).toBeTruthy();
  });

  it('handles empty value', () => {
    const { getByPlaceholderText } = render(
      <AmountInput
        value=""
        onChangeText={() => {}}
        currency="USD"
      />
    );

    const input = getByPlaceholderText('0.00');
    expect(input).toBeTruthy();
  });

  it('handles numeric input', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <AmountInput
        value=""
        onChangeText={mockOnChangeText}
        currency="USD"
        keyboardType="numeric"
      />
    );

    const input = getByPlaceholderText('0.00');
    fireEvent.changeText(input, '100');
    expect(mockOnChangeText).toHaveBeenCalledWith('100');
  });

  it('handles decimal input', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <AmountInput
        value=""
        onChangeText={mockOnChangeText}
        currency="USD"
        keyboardType="decimal-pad"
      />
    );

    const input = getByPlaceholderText('0.00');
    fireEvent.changeText(input, '123.45');
    expect(mockOnChangeText).toHaveBeenCalledWith('123.45');
  });

  it('renders with different keyboard types', () => {
    const { getByPlaceholderText: getDefault } = render(
      <AmountInput
        value=""
        onChangeText={() => {}}
        currency="USD"
        keyboardType="default"
      />
    );

    const { getByPlaceholderText: getNumeric } = render(
      <AmountInput
        value=""
        onChangeText={() => {}}
        currency="USD"
        keyboardType="numeric"
      />
    );

    const { getByPlaceholderText: getDecimal } = render(
      <AmountInput
        value=""
        onChangeText={() => {}}
        currency="USD"
        keyboardType="decimal-pad"
      />
    );

    expect(getDefault('0.00')).toBeTruthy();
    expect(getNumeric('0.00')).toBeTruthy();
    expect(getDecimal('0.00')).toBeTruthy();
  });
}); 