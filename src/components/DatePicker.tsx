import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../constants/colors';
import { formatDateDDMMYYYY, parseDateDDMMYYYY } from '../utils/dateUtils';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  label?: string;
  error?: string;
  minimumDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label = 'Date',
  error,
  minimumDate = new Date(),
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(
    value ? parseDateDDMMYYYY(value) || new Date() : new Date()
  );

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setIsVisible(false);
    }
    
    if (selectedDate) {
      setTempDate(selectedDate);
      if (Platform.OS === 'ios') {
        // For iOS, we'll update when user confirms
      } else {
        // For Android, update immediately
        onChange(formatDateDDMMYYYY(selectedDate.toISOString()));
      }
    }
  };

  const handleConfirm = () => {
    onChange(formatDateDDMMYYYY(tempDate.toISOString()));
    setIsVisible(false);
  };

  const handleCancel = () => {
    setTempDate(value ? parseDateDDMMYYYY(value) || new Date() : new Date());
    setIsVisible(false);
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
        <Text style={styles.dateText}>
          {value || 'Select date'}
        </Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {Platform.OS === 'ios' ? (
        <Modal
          visible={isVisible}
          transparent
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={handleConfirm}>
                  <Text style={styles.confirmButton}>Done</Text>
                </TouchableOpacity>
              </View>
              
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={minimumDate}
                style={styles.dateTimePicker}
              />
            </View>
          </View>
        </Modal>
      ) : (
        isVisible && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={minimumDate}
          />
        )
      )}
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
  dateText: {
    fontSize: 16,
    color: COLORS.onSurface,
    flex: 1,
  },
  calendarIcon: {
    fontSize: 20,
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
  cancelButton: {
    fontSize: 16,
    color: COLORS.placeholder,
  },
  confirmButton: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  dateTimePicker: {
    backgroundColor: COLORS.background,
  },
});

export default DatePicker;
