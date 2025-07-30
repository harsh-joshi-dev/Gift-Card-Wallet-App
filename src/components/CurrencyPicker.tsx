import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { CURRENCIES } from '../constants/currencies';
import { Currency } from '../types/giftCard';

interface CurrencyPickerProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  label?: string;
  error?: string;
}

const CurrencyPicker: React.FC<CurrencyPickerProps> = ({
  selectedCurrency,
  onCurrencyChange,
  label = 'Currency',
  error,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCurrencyData = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];
  
  const filteredCurrencies = CURRENCIES.filter(currency =>
    currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCurrency = (currency: Currency) => {
    onCurrencyChange(currency.code);
    setIsVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, error && styles.labelError]}>
        {label}
      </Text>
      
      <TouchableOpacity
        style={[styles.picker, error && styles.pickerError]}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.selectedCurrency}>
          <Text style={styles.currencyFlag}>{selectedCurrencyData.flag}</Text>
          <Text style={styles.currencyCode}>{selectedCurrencyData.code}</Text>
          <Text style={styles.currencyName}>{selectedCurrencyData.name}</Text>
        </View>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search currencies..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.placeholder}
            />

            <FlatList
              data={filteredCurrencies}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.currencyItem,
                    selectedCurrency === item.code && styles.selectedItem
                  ]}
                  onPress={() => handleSelectCurrency(item)}
                >
                  <View style={styles.currencyItemContent}>
                    <Text style={styles.currencyItemFlag}>{item.flag}</Text>
                    <View style={styles.currencyItemText}>
                      <Text style={styles.currencyItemCode}>{item.code}</Text>
                      <Text style={styles.currencyItemName}>{item.name}</Text>
                    </View>
                    <Text style={styles.currencyItemSymbol}>{item.symbol}</Text>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.placeholder,
    marginBottom: 8,
    fontWeight: '500',
  },
  labelError: {
    color: COLORS.error,
  },
  picker: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerError: {
    borderColor: COLORS.error,
  },
  selectedCurrency: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currencyFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.onSurface,
    marginRight: 8,
  },
  currencyName: {
    fontSize: 14,
    color: COLORS.placeholder,
    flex: 1,
  },
  arrow: {
    fontSize: 12,
    color: COLORS.placeholder,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.onSurface,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.onSurface,
  },
  searchInput: {
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    fontSize: 16,
    color: COLORS.onSurface,
    backgroundColor: COLORS.surface,
  },
  currencyItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedItem: {
    backgroundColor: COLORS.primary + '20',
  },
  currencyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyItemFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  currencyItemText: {
    flex: 1,
  },
  currencyItemCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.onSurface,
  },
  currencyItemName: {
    fontSize: 14,
    color: COLORS.placeholder,
    marginTop: 2,
  },
  currencyItemSymbol: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default CurrencyPicker;
