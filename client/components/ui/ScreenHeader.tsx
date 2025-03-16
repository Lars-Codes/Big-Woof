import React from "react";
import { View, StyleSheet } from "react-native";
import { COLORS, SPACING } from "../../styles/theme";

import { ReactNode } from "react";

const ScreenHeader = ({ children }: { children: ReactNode }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
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