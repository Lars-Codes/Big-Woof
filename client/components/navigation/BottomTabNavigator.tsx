import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeIcon, CalendarIcon, Users, Scissors } from "lucide-react-native";

// Import actual screens
import HomeScreen from "../screens/HomeScreen";
import AppointmentsScreen from "../screens/AppointmentsScreen";
import ClientsScreen from "../screens/ClientsScreen";
import ServicesScreen from "../screens/ServicesScreen";
import AddAppointmentScreen from "../screens/AddAppointmentScreen";

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
        tabBarActiveTintColor: "#503D42", // Active icon color
        tabBarInactiveTintColor: "#748B75", // Inactive icon color
        tabBarStyle: {
          backgroundColor: "#F5FBEF",
          height: 84,
          paddingBottom: 8,
          paddingTop: 8 ,
        }, // Custom styling
        headerStyle: {
          backgroundColor: "#F5FBEF",
        },
        headerTintColor: "#503D42",
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