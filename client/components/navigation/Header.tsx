import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../styles/theme';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Big Woof</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 110,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.xxl,
  },
  headerText: {
    color: COLORS.background,
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.bold as any,
  },
});

export default Header;