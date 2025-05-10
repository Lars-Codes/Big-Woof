import "./global.css";

import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import store from "./src/state/store";
import "./src/sagas/rootSaga";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { UserListIcon } from "@hugeicons/core-free-icons";

import TestScreen from "./src/components/clients/screens/clientsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerTitle: "App Name",
          }}
        >
          <Tab.Screen
            name="Clients"
            component={TestScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <HugeiconsIcon icon={UserListIcon} size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
