import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Alert,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { RootState } from '../types/giftCard';
import { loadGiftCards, deleteGiftCard, clearError } from '../store/giftCardSlice';
import GiftCardItem from '../components/GiftCardItem';
import CustomButton from '../components/CustomButton';
import AddIcon from '../components/AddIcon';
import CurrencyFilter from '../components/CurrencyFilter';
import { GiftCard } from '../types/giftCard';
import { getCurrencyByCode } from '../constants/currencies';

interface HomeScreenProps {
  navigation: any;
}

/**
 * Main home screen that displays the list of gift cards
 * Handles filtering, deletion, and navigation to other screens
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { cards, error } = useSelector((state: RootState) => state.giftCards);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load gift cards on component mount
  useEffect(() => {
    dispatch(loadGiftCards());
  }, [dispatch]);

  // Show error alerts and clear them when dismissed
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: () => dispatch(clearError()) }
      ]);
    }
  }, [error, dispatch]);

  // Navigation handlers
  const handleCardPress = useCallback((card: GiftCard) => {
    navigation.navigate('CardDetail', { card });
  }, [navigation]);

  const handleDeleteCard = useCallback((cardId: string) => {
    // Show confirmation dialog before deleting
    Alert.alert(
      'Delete Gift Card',
      'Are you sure you want to delete this gift card?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            dispatch(deleteGiftCard(cardId)).catch((_deleteError) => {
              Alert.alert('Error', 'Failed to delete gift card. Please try again.');
            });
          }
        },
      ]
    );
  }, [dispatch]);

  const handleAddCard = useCallback(() => {
    navigation.navigate('AddCard');
  }, [navigation]);

  // Filter handlers
  const handleCurrencyFilter = useCallback((currency: string | null) => {
    setSelectedCurrency(currency);
  }, []);

  const clearFilter = useCallback(() => {
    setSelectedCurrency(null);
  }, []);

  // Pull to refresh functionality
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(loadGiftCards()).unwrap();
    } catch (refreshError) {
      Alert.alert('Error', 'Failed to refresh gift cards. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Get available currencies from cards - memoized for performance
  const availableCurrencies = useMemo(() => {
    const currencies = [...new Set(cards.map(card => card.currency))];
    return currencies.sort();
  }, [cards]);

  // Filter cards based on selected currency - memoized for performance
  const filteredCards = useMemo(() => {
    if (!selectedCurrency) {
      return cards;
    }
    return cards.filter(card => card.currency === selectedCurrency);
  }, [cards, selectedCurrency]);

  // Calculate total value of filtered cards
  const totalValue = useMemo(() => {
    return filteredCards.reduce((total, card) => total + card.amount, 0);
  }, [filteredCards]);

  // Format total value for display
  const formattedTotalValue = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(totalValue) + ' Total';
  }, [totalValue]);

  // FlatList optimization - memoized render item
  const renderItem = useCallback(({ item }: { item: GiftCard }) => (
    <GiftCardItem
      card={item}
      onPress={handleCardPress}
      onDelete={handleDeleteCard}
    />
  ), [handleCardPress, handleDeleteCard]);

  // FlatList optimization - memoized key extractor
  const keyExtractor = useCallback((item: GiftCard) => item.id, []);

  // FlatList optimization - getItemLayout for better performance
  const getItemLayout = useCallback((data: ArrayLike<GiftCard> | null | undefined, index: number) => ({
    length: 130, // Approximate height of GiftCardItem
    offset: 130 * index,
    index,
  }), []);

  // Empty state when no cards exist
  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Text style={styles.emptyStateEmoji}>🎁</Text>
      </View>
      <Text style={styles.emptyStateTitle}>No Gift Cards Yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Add your first gift card to get started
      </Text>
    </View>
  ), []);

  // Header with title, summary, and filter info
  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Gift Card Wallet</Text>
          <Text style={styles.subtitle}>Manage your gift cards</Text>
        </View>
        <View style={styles.walletIcon}>
          <Text style={styles.walletEmoji}>🎁</Text>
        </View>
      </View>
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Value</Text>
          <Text style={styles.summaryValue}>{formattedTotalValue}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Cards</Text>
          <Text style={styles.summaryValue}>
            {filteredCards.length}{selectedCurrency ? ` / ${cards.length}` : ''}
          </Text>
        </View>
      </View>
      {/* Show filter info when currency filter is active */}
      {selectedCurrency && (
        <View style={styles.filterInfo}>
          <Text style={styles.filterText}>
            Filtered by: {getCurrencyByCode(selectedCurrency)?.code}
          </Text>
          <TouchableOpacity onPress={clearFilter} style={styles.clearFilterButton}>
            <Text style={styles.clearFilterText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  ), [formattedTotalValue, filteredCards.length, cards.length, selectedCurrency, clearFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF"
        translucent={false}
        animated={true}
      />
      
      <View style={styles.container}>
        {renderHeader()}
        
        {cards.length === 0 ? (
          <>
            {renderEmptyState()}
            <TouchableOpacity style={styles.fab} onPress={handleAddCard}>
              <AddIcon size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        ) : filteredCards.length === 0 && selectedCurrency ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Text style={styles.emptyStateEmoji}>🔍</Text>
            </View>
            <Text style={styles.emptyStateTitle}>No Cards Found</Text>
            <Text style={styles.emptyStateSubtitle}>
              No gift cards found for {getCurrencyByCode(selectedCurrency)?.code}
            </Text>
            <CustomButton
              title="Clear Filter"
              onPress={clearFilter}
              style={styles.addButton}
            />
          </View>
        ) : (
          <>
            <CurrencyFilter
              selectedCurrency={selectedCurrency}
              onCurrencySelect={handleCurrencyFilter}
              availableCurrencies={availableCurrencies}
            />
            <FlatList
              data={filteredCards}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              getItemLayout={getItemLayout}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
              initialNumToRender={8}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#007AFF']}
                  tintColor="#007AFF"
                />
              }
            />
            <TouchableOpacity style={styles.fab} onPress={handleAddCard}>
              <AddIcon size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </>
        )}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
    fontWeight: '400',
  },
  walletIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletEmoji: {
    fontSize: 32,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '400',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 22,
    color: '#007AFF',
    fontWeight: '600',
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateEmoji: {
    fontSize: 48,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  addButton: {
    width: '100%',
  },
  filterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  filterText: {
    fontSize: 15,
    color: '#8E8E93',
  },
  clearFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  clearFilterText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 34,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 0,
  },
});

export default HomeScreen; 