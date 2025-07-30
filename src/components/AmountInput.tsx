import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { getCurrencyByCode } from '../constants/currencies';

interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  currency: string;
  placeholder?: string;
  error?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
}

const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChangeText,
  currency,
  placeholder = '0.00',
  error,
  keyboardType = 'decimal-pad',
}) => {
  const currencyData = getCurrencyByCode(currency);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, error && styles.labelError]}>
        Amount
      </Text>
      
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Text style={styles.currencyIcon}>{currencyData?.flag || currency}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  currencyIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.onSurface,
    padding: 0,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default AmountInput; 