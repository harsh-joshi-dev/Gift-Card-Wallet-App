import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface GiftCardIconProps {
  size?: number;
  color?: string;
}

const GiftCardIcon: React.FC<GiftCardIconProps> = ({ 
  size = 60, 
  color = COLORS.primary 
}) => {
  return (
    <View style={[styles.container, { width: size, height: size * 0.6 }]}>
      <View style={[styles.card, { backgroundColor: color }]}>
        <View style={styles.chip} />
        <View style={styles.brandLine} />
        <View style={styles.brandLine2} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chip: {
    width: 12,
    height: 8,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    alignSelf: 'flex-start',
  },
  brandLine: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 1,
    marginBottom: 2,
  },
  brandLine2: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 1,
    width: '60%',
  },
});

export default GiftCardIcon; 