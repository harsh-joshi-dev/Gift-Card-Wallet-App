import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface AddIconProps {
  size?: number;
  color?: string;
}

const AddIcon: React.FC<AddIconProps> = ({ 
  size = 24, 
  color = COLORS.onPrimary 
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.horizontalLine, { backgroundColor: color, width: size * 0.6 }]} />
      <View style={[styles.verticalLine, { backgroundColor: color, height: size * 0.6 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  horizontalLine: {
    position: 'absolute',
    height: 3,
    borderRadius: 1.5,
  },
  verticalLine: {
    position: 'absolute',
    width: 3,
    borderRadius: 1.5,
  },
});

export default AddIcon;
