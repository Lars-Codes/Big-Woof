import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS, SPACING } from "../../styles/theme";

import { ReactNode } from "react";

const ScreenHeader = ({ children }: { children: ReactNode }) => {
  return (
    <View style={styles.header}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
});

export default ScreenHeader;