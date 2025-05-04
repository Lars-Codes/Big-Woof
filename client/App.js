import React from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import store from "./src/state/store";
import "./src/sagas/rootSaga";

import TestScreen from "./src/components/screens/testScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Clients" component={TestScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
