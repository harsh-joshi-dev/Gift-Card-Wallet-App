import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { GiftCard } from '../types/giftCard';
import { formatDate, isExpired, isExpiringSoon, getDaysUntilExpiration } from '../utils/dateUtils';
import { formatCurrency } from '../utils/currencyUtils';

interface GiftCardItemProps {
  card: GiftCard;
  onPress: (card: GiftCard) => void;
  onDelete: (cardId: string) => void;
}

/**
 * Individual gift card item component for the list
 * Shows card details, expiration status, and handles interactions
 * Memoized for performance optimization in FlatList
 */
const GiftCardItem: React.FC<GiftCardItemProps> = React.memo(({ card, onPress, onDelete }) => {
  // Event handlers - memoized to prevent unnecessary re-renders
  const handleDelete = useCallback(() => {
    onDelete(card.id);
  }, [card.id, onDelete]);

  const handlePress = useCallback(() => {
    onPress(card);
  }, [card, onPress]);

  // Calculate status color based on expiration date
  const statusColor = useMemo(() => {
    if (isExpired(card.expirationDate)) {
      return '#FF3B30'; // Red for expired
    }
    if (isExpiringSoon(card.expirationDate, 15)) {
      return '#FF9500'; // Orange for expiring soon
    }
    return '#007AFF'; // Blue for valid cards
  }, [card.expirationDate]);

  // Generate status text with appropriate messaging
  const statusText = useMemo(() => {
    if (isExpired(card.expirationDate)) {
      return 'Expired';
    }
    if (isExpiringSoon(card.expirationDate, 15)) {
      const days = getDaysUntilExpiration(card.expirationDate);
      return `Expires in ${days} days`;
    }
    return 'Valid';
  }, [card.expirationDate]);

  // Format currency amount for display
  const formattedAmount = useMemo(() => {
    return formatCurrency(card.amount, card.currency);
  }, [card.amount, card.currency]);

  // Format expiration date for display
  const formattedDate = useMemo(() => {
    return formatDate(card.expirationDate);
  }, [card.expirationDate]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.card}>
        <View style={styles.mainContent}>
          {/* Header with brand name and delete button */}
          <View style={styles.header}>
            <View style={styles.brandSection}>
              <Text style={styles.brand}>{card.brand}</Text>
              <Text style={styles.subtitle}>Gift Card</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.deleteText}>×</Text>
            </TouchableOpacity>
          </View>
          
          {/* Amount section with currency icon */}
          <View style={styles.amountSection}>
            <Text style={styles.amount}>
              {formattedAmount}
            </Text>
            <View style={styles.currencyIcon}>
              <Text style={styles.currencyEmoji}>💳</Text>
            </View>
          </View>
          
          {/* Footer with expiration info and status badge */}
          <View style={styles.footer}>
            <Text style={styles.expirationLabel}>Expires</Text>
            <Text style={styles.expirationDate}>{formattedDate}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{statusText}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

GiftCardItem.displayName = 'GiftCardItem';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 8,
  },
  card: {
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 0,
    minHeight: 120,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  brandSection: {
    flex: 1,
  },
  brand: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '400',
  },
  deleteButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FF3B3015',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B3030',
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  amountSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  currencyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  currencyEmoji: {
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expirationLabel: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '400',
    marginBottom: 2,
  },
  expirationDate: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default GiftCardItem; 