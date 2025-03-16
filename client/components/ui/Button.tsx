import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
} from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../styles/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...rest
}) => {
  const getButtonStyles = () => {
    let buttonStyles: ViewStyle[] = [styles.button];

    // Apply size styles
    if (size === 'small') buttonStyles.push(styles.buttonSmall);
    if (size === 'medium') buttonStyles.push(styles.buttonMedium);
    if (size === 'large') buttonStyles.push(styles.buttonLarge);

    // Apply variant styles
    if (variant === 'primary') buttonStyles.push(styles.buttonPrimary);
    if (variant === 'secondary') buttonStyles.push(styles.buttonSecondary);
    if (variant === 'outline') buttonStyles.push(styles.buttonOutline);
    if (variant === 'text') buttonStyles.push(styles.buttonText);

    // Apply disabled state
    if (disabled || loading) buttonStyles.push(styles.buttonDisabled);

    // Apply custom styles
    if (style) buttonStyles.push(style);

    return buttonStyles;
  };

  const getTextStyles = () => {
    let textStyles: TextStyle[] = [styles.text];

    // Apply size styles
    if (size === 'small') textStyles.push(styles.textSmall);
    if (size === 'medium') textStyles.push(styles.textMedium);
    if (size === 'large') textStyles.push(styles.textLarge);

    // Apply variant text styles
    if (variant === 'primary') textStyles.push(styles.textPrimary);
    if (variant === 'secondary') textStyles.push(styles.textSecondary);
    if (variant === 'outline') textStyles.push(styles.textOutline);
    if (variant === 'text') textStyles.push(styles.textText);

    // Apply disabled state
    if (disabled) textStyles.push(styles.textDisabled);

    // Apply custom text styles
    if (textStyle) textStyles.push(textStyle);

    return textStyles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'text' ? COLORS.primary : COLORS.white} 
        />
      ) : (
        <>
          {leftIcon && leftIcon}
          <Text style={getTextStyles()}>{title}</Text>
          {rightIcon && rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
  },
  buttonSmall: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  buttonMedium: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  buttonLarge: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: FONTS.weights.medium as TextStyle['fontWeight'],
    textAlign: 'center',
  },
  textSmall: {
    fontSize: FONTS.sizes.sm,
  },
  textMedium: {
    fontSize: FONTS.sizes.md,
  },
  textLarge: {
    fontSize: FONTS.sizes.lg,
  },
  textPrimary: {
    color: COLORS.white,
  },
  textSecondary: {
    color: COLORS.white,
  },
  textOutline: {
    color: COLORS.primary,
  },
  textText: {
    color: COLORS.primary,
  },
  textDisabled: {
    color: COLORS.white,
  },
});

export default Button;