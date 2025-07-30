import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { saveGiftCard, updateGiftCard, clearError } from '../store/giftCardSlice';
import { AppDispatch } from '../store';
import { RootState } from '../types/giftCard';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CurrencyPicker from '../components/CurrencyPicker';
import DatePicker from '../components/DatePicker';
import AmountInput from '../components/AmountInput';
import { GiftCardFormData, GiftCard } from '../types/giftCard';
import { validateCurrency } from '../utils/currencyUtils';
import { parseDateDDMMYYYY } from '../utils/dateUtils';

interface AddCardScreenProps {
  navigation: any;
  route: {
    params?: {
      card?: GiftCard;
      isEditing?: boolean;
    };
  };
}

const AddCardScreen: React.FC<AddCardScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.giftCards);
  const isEditing = route.params?.isEditing || false;
  const cardToEdit = route.params?.card;
  
  const [formData, setFormData] = useState<GiftCardFormData>({
    brand: cardToEdit?.brand || '',
    amount: cardToEdit?.amount?.toString() || '',
    currency: cardToEdit?.currency || 'USD',
    expirationDate: cardToEdit?.expirationDate || '',
    cardNumber: cardToEdit?.cardNumber || '',
    pin: cardToEdit?.pin || '',
    notes: cardToEdit?.notes || '',
  });
  
  const [errors, setErrors] = useState<Partial<GiftCardFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear error when component unmounts or error changes
  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: () => dispatch(clearError()) }
      ]);
    }
  }, [error, dispatch]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<GiftCardFormData> = {};

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (!validateCurrency(formData.amount)) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.expirationDate.trim()) {
      newErrors.expirationDate = 'Expiration date is required';
    } else {
      const expirationDate = parseDateDDMMYYYY(formData.expirationDate);
      if (!expirationDate) {
        newErrors.expirationDate = 'Please enter a valid date';
      } else {
        const today = new Date();
        // Create today's date at start of day for accurate comparison
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
        
        if (expirationDate < todayStart) {
          newErrors.expirationDate = 'Expiration date must be today or in the future';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && cardToEdit) {
        await dispatch(updateGiftCard({ id: cardToEdit.id, cardData: formData })).unwrap();
        Alert.alert(
          'Success',
          'Gift card updated successfully!',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.goBack() 
            }
          ]
        );
      } else {
        await dispatch(saveGiftCard(formData)).unwrap();
        Alert.alert(
          'Success',
          'Gift card added successfully!',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.goBack() 
            }
          ]
        );
      }
    } catch (submitError) {
      Alert.alert(
        'Error',
        isEditing 
          ? 'Failed to update gift card. Please try again.'
          : 'Failed to add gift card. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, isEditing, cardToEdit, formData, dispatch, navigation]);

  const updateFormData = useCallback((field: keyof GiftCardFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const isFormValid = useMemo((): boolean => {
    return formData.brand.trim() !== '' && 
           formData.amount.trim() !== '' && 
           validateCurrency(formData.amount) && 
           parseFloat(formData.amount) > 0 &&
           formData.expirationDate.trim() !== '';
  }, [formData]);

  const handleCancel = useCallback(() => {
    if (isFormValid) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  }, [isFormValid, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF"
        translucent={false}
        animated={true}
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Scrollable Form Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <CustomInput
              label="Brand"
              value={formData.brand}
              onChangeText={(value) => updateFormData('brand', value)}
              placeholder="e.g., Amazon, Walmart, Starbucks"
              error={errors.brand}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <AmountInput
              value={formData.amount}
              onChangeText={(value) => updateFormData('amount', value)}
              currency={formData.currency}
              placeholder="0.00"
              error={errors.amount}
            />

            <CurrencyPicker
              selectedCurrency={formData.currency}
              onCurrencyChange={(currency) => updateFormData('currency', currency)}
            />

            <DatePicker
              value={formData.expirationDate}
              onChange={(date) => updateFormData('expirationDate', date)}
              label="Expiration Date"
              error={errors.expirationDate}
            />

            <CustomInput
              label="Card Number (Optional)"
              value={formData.cardNumber}
              onChangeText={(value) => updateFormData('cardNumber', value)}
              placeholder="Enter card number if available"
              keyboardType="numeric"
              maxLength={19}
            />

            <CustomInput
              label="PIN (Optional)"
              value={formData.pin}
              onChangeText={(value) => updateFormData('pin', value)}
              placeholder="Enter PIN if available"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />

            <CustomInput
              label="Notes (Optional)"
              value={formData.notes}
              onChangeText={(value) => updateFormData('notes', value)}
              placeholder="Add any additional notes"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* Fixed Bottom Buttons */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Cancel"
            onPress={handleCancel}
            variant="outline"
            style={styles.cancelButton}
          />
          <CustomButton
            title={isEditing ? 'Update Card' : 'Add Card'}
            onPress={handleSubmit}
            loading={isSubmitting || loading}
            disabled={!isFormValid || isSubmitting || loading}
            variant={!isFormValid || isSubmitting || loading ? 'secondary' : 'primary'}
            style={styles.submitButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20, // Reduced padding since buttons are now outside scroll
  },
  form: {
    gap: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 34, // Account for home indicator
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    gap: 12,
  },
  cancelButton: {
    flex: 0.3, // Smaller button
  },
  submitButton: {
    flex: 0.7, // Larger button
  },
});

export default AddCardScreen; 