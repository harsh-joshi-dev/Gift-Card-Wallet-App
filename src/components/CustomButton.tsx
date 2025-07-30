import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Reusable button component with multiple variants and states
 * Supports loading, disabled states, and custom styling
 */
const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  // Build button style based on variant, size, and state
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle[] = [styles.button, styles[size]];
    
    if (variant === 'outline') {
      baseStyle.push(styles.outline);
      // Allow custom border color override via style prop
      if (style && typeof style === 'object' && 'borderColor' in style) {
        baseStyle.push({ borderColor: (style as any).borderColor });
      }
    } else if (variant === 'primary') {
      baseStyle.push(styles.primary);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondary);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabled);
    }
    
    return Object.assign({}, ...baseStyle);
  };

  // Build text style based on variant, size, and state
  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle[] = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'outline') {
      baseStyle.push(styles.outlineText);
      // Allow custom text color override via textStyle prop
      if (textStyle && typeof textStyle === 'object' && 'color' in textStyle) {
        baseStyle.push({ color: (textStyle as any).color });
      }
    } else if (variant === 'primary') {
      baseStyle.push(styles.primaryText);
    } else if (variant === 'secondary') {
      baseStyle.push(styles.secondaryText);
    }
    
    if (disabled) {
      baseStyle.push(styles.disabledText);
    }
    
    return Object.assign({}, ...baseStyle);
  };

  // Render loading spinner or text based on loading state
  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#007AFF' : '#FFFFFF'}
          size="small"
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </>
  );

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#6C757D',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  outlineText: {
    color: '#007AFF',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: '#8E8E93',
  },
});

export default CustomButton; 