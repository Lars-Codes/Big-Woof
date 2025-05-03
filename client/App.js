import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Provider, useDispatch } from "react-redux";
import store from "./src/state/store";
import './src/sagas/rootSaga'; // Import the root saga
import TestScreen from "./src/components/screens/testScreen";

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <TestScreen />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
