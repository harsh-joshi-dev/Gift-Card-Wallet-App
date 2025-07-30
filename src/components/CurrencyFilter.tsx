import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import { getCurrencyByCode } from '../constants/currencies';

interface CurrencyFilterProps {
  selectedCurrency: string | null;
  onCurrencySelect: (currency: string | null) => void;
  availableCurrencies: string[];
}

const CurrencyFilter: React.FC<CurrencyFilterProps> = ({
  selectedCurrency,
  onCurrencySelect,
  availableCurrencies,
}) => {
  const handleCurrencyPress = (currency: string | null) => {
    onCurrencySelect(currency);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter by Currency</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* All currencies option */}
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedCurrency === null && styles.selectedChip
          ]}
          onPress={() => handleCurrencyPress(null)}
          activeOpacity={0.7}
        >
          <Text style={styles.currencyFlag}>🎁</Text>
          <Text style={[
            styles.chipText,
            selectedCurrency === null && styles.selectedChipText
          ]}>
            All Cards
          </Text>
        </TouchableOpacity>

        {/* Currency options */}
        {availableCurrencies.map((currencyCode) => {
          const currency = getCurrencyByCode(currencyCode);
          return (
            <TouchableOpacity
              key={currencyCode}
              style={[
                styles.filterChip,
                selectedCurrency === currencyCode && styles.selectedChip
              ]}
              onPress={() => handleCurrencyPress(currencyCode)}
              activeOpacity={0.7}
            >
              <Text style={styles.currencyFlag}>{currency?.flag}</Text>
              <Text style={[
                styles.chipText,
                selectedCurrency === currencyCode && styles.selectedChipText
              ]}>
                {currency?.code}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    gap: 6,
  },
  selectedChip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  selectedChipText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  currencyFlag: {
    fontSize: 14,
  },
});

export default CurrencyFilter; 