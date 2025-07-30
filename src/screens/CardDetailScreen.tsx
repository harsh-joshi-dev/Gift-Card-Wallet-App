import React, { useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteGiftCard, clearError } from '../store/giftCardSlice';
import { RootState } from '../types/giftCard';
import { AppDispatch } from '../store';
import { COLORS } from '../constants/colors';
import CustomButton from '../components/CustomButton';
import GiftCardIcon from '../components/GiftCardIcon';
import { formatDate, isExpired, isExpiringSoon, getDaysUntilExpiration } from '../utils/dateUtils';
import { formatCurrency } from '../utils/currencyUtils';

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type CardDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CardDetail'>;
type CardDetailScreenRouteProp = RouteProp<RootStackParamList, 'CardDetail'>;

interface CardDetailScreenProps {
  navigation: CardDetailScreenNavigationProp;
  route: CardDetailScreenRouteProp;
}

const CardDetailScreen: React.FC<CardDetailScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { cards, loading, error } = useSelector((state: RootState) => state.giftCards);
  const { card: initialCard } = route.params;
  
  // Get the latest card data from Redux store
  const card = useMemo(() => {
    return cards.find(c => c.id === initialCard.id) || initialCard;
  }, [cards, initialCard]);

  // Clear error when component unmounts or error changes
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: () => dispatch(clearError()) }
      ]);
    }
  }, [error, dispatch]);

  // Force re-render when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // This will trigger a re-render when the screen comes into focus
    });

    return unsubscribe;
  }, [navigation]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Gift Card',
      `Are you sure you want to delete the ${card.brand} gift card?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await dispatch(deleteGiftCard(card.id)).unwrap();
              Alert.alert(
                'Success',
                'Gift card deleted successfully!',
                [
                  { text: 'OK', onPress: () => navigation.goBack() }
                ]
              );
            } catch (deleteError) {
              Alert.alert('Error', 'Failed to delete gift card. Please try again.');
            }
          }
        },
      ]
    );
  }, [card.brand, card.id, dispatch, navigation]);

  const handleEdit = useCallback(() => {
    navigation.navigate('AddCard', { 
      card, 
      isEditing: true 
    });
  }, [navigation, card]);

  // Memoized status calculations for performance
  const statusColor = useMemo(() => {
    if (isExpired(card.expirationDate)) {
      return COLORS.error;
    }
    if (isExpiringSoon(card.expirationDate, 15)) {
      return COLORS.warning;
    }
    return COLORS.info; // Blue for cards expiring after 15 days
  }, [card.expirationDate]);

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

  // Memoized formatted values for performance
  const formattedAmount = useMemo(() => {
    return formatCurrency(card.amount, card.currency);
  }, [card.amount, card.currency]);

  const formattedDate = useMemo(() => {
    return formatDate(card.expirationDate);
  }, [card.expirationDate]);

  const renderDetailRow = useCallback((label: string, value: string, isImportant = false) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[
        styles.detailValue,
        isImportant && styles.importantValue
      ]}>
        {value}
      </Text>
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF"
        translucent={false}
        animated={true}
      />
      
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section with Card Icon */}
          <View style={styles.header}>
            <View style={styles.cardIconContainer}>
              <GiftCardIcon size={100} color="#007AFF" />
            </View>
            <Text style={styles.brandTitle}>{card.brand}</Text>
            <Text style={styles.cardType}>Gift Card</Text>
            
            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{statusText}</Text>
            </View>
          </View>

          {/* Amount Section */}
          <View style={styles.amountSection}>
            <View style={styles.amountCard}>
              <Text style={styles.amountLabel}>Current Balance</Text>
              <Text style={styles.amountValue}>{formattedAmount}</Text>
              <View style={styles.currencyIcon}>
                <Text style={styles.currencyEmoji}>💳</Text>
              </View>
            </View>
          </View>

          {/* Card Details Section */}
          <View style={styles.detailsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Card Details</Text>
              <View style={styles.sectionIcon}>
                <Text style={styles.sectionEmoji}>📋</Text>
              </View>
            </View>
            
            <View style={styles.detailsCard}>
              {renderDetailRow('Brand', card.brand)}
              {renderDetailRow('Amount', formattedAmount, true)}
              {renderDetailRow('Currency', card.currency)}
              {renderDetailRow('Expiration Date', formattedDate)}
              
              {card.cardNumber && renderDetailRow('Card Number', card.cardNumber)}
              {card.pin && renderDetailRow('PIN', '••••')}
              {card.notes && renderDetailRow('Notes', card.notes)}
            </View>
          </View>

          {/* Additional Information Section */}
          <View style={styles.metadataSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <View style={styles.sectionIcon}>
                <Text style={styles.sectionEmoji}>ℹ️</Text>
              </View>
            </View>
            
            <View style={styles.metadataCard}>
              {renderDetailRow('Created', new Date(card.createdAt).toLocaleDateString())}
              {renderDetailRow('Last Updated', new Date(card.updatedAt).toLocaleDateString())}
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <CustomButton
            title="Edit Card"
            onPress={handleEdit}
            variant="outline"
            style={styles.editButton}
          />
          <CustomButton
            title="Delete Card"
            onPress={handleDelete}
            variant="outline"
            loading={loading}
            style={styles.deleteButton}
            textStyle={styles.deleteButtonText}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 140, // Add space for fixed buttons
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  cardIconContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 50,
    backgroundColor: '#F2F2F7',
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardType: {
    fontSize: 19,
    color: '#8E8E93',
    fontWeight: '400',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  amountSection: {
    marginBottom: 24,
  },
  amountCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#F2F2F7',
    position: 'relative',
  },
  amountLabel: {
    fontSize: 17,
    color: '#8E8E93',
    marginBottom: 8,
    fontWeight: '400',
  },
  amountValue: {
    fontSize: 38,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
  },
  currencyIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyEmoji: {
    fontSize: 20,
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionEmoji: {
    fontSize: 16,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 0,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  detailLabel: {
    fontSize: 17,
    color: '#8E8E93',
    fontWeight: '400',
    flex: 1,
  },
  detailValue: {
    fontSize: 17,
    color: '#000000',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  importantValue: {
    fontSize: 19,
    fontWeight: '600',
    color: '#007AFF',
  },
  metadataSection: {
    marginBottom: 24,
  },
  metadataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 0,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 34, // Account for home indicator
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    gap: 12,
  },
  editButton: {
    flex: 1,
  },
  deleteButton: {
    flex: 1,
    borderColor: '#FF3B30',
    backgroundColor: 'transparent',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default CardDetailScreen; 