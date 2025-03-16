import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { COLORS, SPACING } from "../../styles/theme";
import { ReactNode } from "react";

interface ScreenHeaderProps {
  children: ReactNode;
  style?: ViewStyle;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ children, style }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.header, style]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.md + 58,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 75,
    justifyContent: "center",
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
});

export default ScreenHeader;