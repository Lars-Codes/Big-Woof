import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeIcon, CalendarIcon, Users, Scissors } from "lucide-react-native";

// Import actual screens
import HomeScreen from "../screens/HomeScreen";
import AppointmentsScreen from "../screens/AppointmentsScreen";
import ClientsScreen from "../screens/Clients/ClientsScreen";
import ServicesScreen from "../screens/ServicesScreen";
import { COLORS, SPACING } from "../../styles/theme";

// Define the param list for the bottom tab navigator
export type BottomTabParamList = {
  Home: undefined;
  Appointments: undefined;
  Clients: undefined;
  Services: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let Icon: React.ElementType = HomeIcon; // Default icon
          if (route.name === "Home") Icon = HomeIcon;
          if (route.name === "Appointments") Icon = CalendarIcon;
          if (route.name === "Clients") Icon = Users;
          if (route.name === "Services") Icon = Scissors;
          return <Icon color={color} size={size} />;
        },
        tabBarActiveTintColor: COLORS.primary, // Active icon color
        tabBarInactiveTintColor: COLORS.secondary, // Inactive icon color
        tabBarStyle: {
          backgroundColor: COLORS.background,
          height: SPACING.xxl,
          paddingBottom: SPACING.sm + 60,
          paddingTop: SPACING.sm,
        }, // Custom styling
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.primary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Appointments" component={AppointmentsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Clients" component={ClientsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Services" component={ServicesScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}