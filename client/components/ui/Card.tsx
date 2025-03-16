import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, SHADOWS } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  backgroundColor?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  backgroundColor = COLORS.background,
}) => {
  const getCardStyles = () => {
    let cardStyles: ViewStyle[] = [styles.card];

    // Apply variant styles
    if (variant === 'default') {
      cardStyles.push(styles.cardDefault);
    }
    if (variant === 'elevated') {
      cardStyles.push(styles.cardElevated);
    }
    if (variant === 'outlined') {
      cardStyles.push(styles.cardOutlined);
    }

    // Apply background color
    cardStyles.push({ backgroundColor });

    // Apply custom style
    if (style) {
      cardStyles.push(style);
    }

    return cardStyles;
  };

  return <View style={getCardStyles()}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    marginBottom: 12,
  },
  cardDefault: {
    backgroundColor: COLORS.background,
  },
  cardElevated: {
    backgroundColor: COLORS.background,
    ...SHADOWS.medium,
  },
  cardOutlined: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
});

export default Card;