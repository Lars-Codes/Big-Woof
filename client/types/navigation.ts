import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define all the route parameters for your stack navigator
export type RootStackParamList = {
  Main: undefined;
  Clients: undefined;
  ClientDetails: { id: string };
  AddClient: undefined;
  AddPet: { clientId?: string };
  Appointments: undefined;
  AddAppointment: { clientId?: string; petId?: string };
  Services: undefined;
  PetDetails: { clientId: string, petId: string };
};

// Create helper types for navigation props
export type ScreenNavigationProp<T extends keyof RootStackParamList> = 
  StackNavigationProp<RootStackParamList, T>;

export type ScreenRouteProp<T extends keyof RootStackParamList> = 
  RouteProp<RootStackParamList, T>;

// Props type for screens
export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: ScreenNavigationProp<T>;
  route: ScreenRouteProp<T>;
};