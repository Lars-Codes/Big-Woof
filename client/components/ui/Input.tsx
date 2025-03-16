import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../styles/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  leftIcon,
  rightIcon,
  placeholder,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <View style={[
        styles.inputContainer, 
        error ? styles.inputError : {},
        inputStyle
      ]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.secondary}
          {...rest}
        />
        
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      
      {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
      {helper && !error && <Text style={[styles.helper, helperStyle]}>{helper}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.secondary,
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    color: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    fontSize: FONTS.sizes.md,
    height: 45,
  },
  iconLeft: {
    paddingLeft: SPACING.md,
  },
  iconRight: {
    paddingRight: SPACING.md,
  },
  error: {
    color: COLORS.error,
    fontSize: FONTS.sizes.xs,
    marginTop: SPACING.xs,
  },
  helper: {
    color: COLORS.secondary,
    fontSize: FONTS.sizes.xs,
    marginTop: SPACING.xs,
  },
});

export default Input;