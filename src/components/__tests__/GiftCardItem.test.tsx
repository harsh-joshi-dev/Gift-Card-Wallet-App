import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GiftCardItem from '../GiftCardItem';
import { GiftCard } from '../../types/giftCard';

const mockCard: GiftCard = {
  id: '1',
  brand: 'Amazon',
  amount: 50.00,
  currency: 'USD',
  expirationDate: '2024-12-31',
  cardNumber: '1234567890123456',
  pin: '1234',
  notes: 'Test gift card',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const mockOnPress = jest.fn();
const mockOnDelete = jest.fn();

describe('GiftCardItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with card information', () => {
    const { getByText } = render(
      <GiftCardItem
        card={mockCard}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );

    expect(getByText('Amazon')).toBeTruthy();
    expect(getByText('$50.00')).toBeTruthy();
    expect(getByText('Dec 31, 2024')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const { getByText } = render(
      <GiftCardItem
        card={mockCard}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.press(getByText('Amazon'));
    expect(mockOnPress).toHaveBeenCalledWith(mockCard);
  });

  it('shows expired status for expired cards', () => {
    const expiredCard = {
      ...mockCard,
      expirationDate: '2020-01-01',
    };

    const { getByText } = render(
      <GiftCardItem
        card={expiredCard}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );

    expect(getByText('Expired')).toBeTruthy();
  });

  it('shows expiring soon status for cards expiring within 15 days', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expiringCard = {
      ...mockCard,
      expirationDate: tomorrow.toISOString().split('T')[0],
    };

    const { getByText } = render(
      <GiftCardItem
        card={expiringCard}
        onPress={mockOnPress}
        onDelete={mockOnDelete}
      />
    );

    expect(getByText('Expires in 1 days')).toBeTruthy();
  });
}); 