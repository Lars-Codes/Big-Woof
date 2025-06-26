import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Blur from 'expo-blur';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ClientDetailsHeaderRight from './ClientDetails/ClientDetailsHeaderRight.js';
import DetailsHeaderLeft from './Details/DetailsHeaderLeft.js';
import FormHeaderRight from './Form/FormHeaderRight.js';
import ListHeaderLeft from './List/ListHeaderLeft.js';
import ListHeaderRight from './List/ListHeaderRight.js';
import PetDetailsHeaderRight from './PetDetails/PetDetailsHeaderRight.js';
import { selectClientDetails } from '../../../../state/clientDetails/clientDetailsSlice.js';
import {
  selectListType,
  setListType,
} from '../../../../state/list/listSlice.js';
import { selectPetDetails } from '../../../../state/petDetails/petDetailsSlice.js';
import ClientDetails from '../../../pages/Clients/ClientDetails.js';
import Clients from '../../../pages/Clients/Clients.js';
import PetDetails from '../../../pages/Pets/PetDetails.js';
import Pets from '../../../pages/Pets/Pets.js';
import ClientForm from '../../forms/Client/ClientForm.js';
import PetForm from '../../forms/Pets/PetForm.js';
import HeaderSelector from '../helpers/HeaderSelector.js';
import HeaderTitle from '../helpers/HeaderTitle.js';

const Stack = createNativeStackNavigator();

export default function Navigator() {
  const dispatch = useDispatch();
  const clientDetails = useSelector(selectClientDetails);
  const petDetails = useSelector(selectPetDetails);
  const listType = useSelector(selectListType);

  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerShown: true,
        animation: 'slide_from_right',
        headerTransparent: true,
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerBackTitleVisible: false,
        headerBackground: () => (
          <Blur.BlurView
            intensity={80}
            tint="light"
            className="flex-1"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
            }}
          />
        ),
      })}
    >
      <Stack.Screen
        name="ClientsAndPetsLists"
        component={listType === 'Clients' ? Clients : Pets}
        options={({ navigation }) => ({
          headerTitle: () => (
            <HeaderSelector
              options={[
                { value: 'Clients', label: 'Clients' },
                { value: 'Pets', label: 'Pets' },
              ]}
              selectedOption={listType}
              onSelect={(value) => {
                dispatch(setListType(value));
              }}
            />
          ),
          headerLeft: () => <ListHeaderLeft />,
          headerRight: () => <ListHeaderRight navigation={navigation} />,
          gestureEnabled: false,
        })}
      />
      <Stack.Screen
        name="ClientDetails"
        component={ClientDetails}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderTitle title="Client Details" />,
          headerLeft: () => <DetailsHeaderLeft navigation={navigation} />,
          headerRight: () => (
            <ClientDetailsHeaderRight navigation={navigation} />
          ),
        })}
      />
      <Stack.Screen
        name="ClientForm"
        component={ClientForm}
        options={({ navigation }) => ({
          presentation: 'modal',
          gestureEnabled: false,
          headerTitle: () => (
            <HeaderTitle title={clientDetails ? 'Edit Client' : 'Add Client'} />
          ),
          headerRight: () => <FormHeaderRight navigation={navigation} />,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          },
        })}
      />
      <Stack.Screen
        name="PetDetails"
        component={PetDetails}
        options={({ navigation }) => ({
          headerTitle: () => <HeaderTitle title="Pet Details" />,
          headerLeft: () => <DetailsHeaderLeft navigation={navigation} />,
          headerRight: () => <PetDetailsHeaderRight navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="PetForm"
        component={PetForm}
        options={({ navigation }) => ({
          presentation: 'modal',
          gestureEnabled: false,
          headerTitle: () => (
            <HeaderTitle title={petDetails ? 'Edit Pet' : 'Add Pet'} />
          ),
          headerRight: () => <FormHeaderRight navigation={navigation} />,
          headerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          },
        })}
      />
    </Stack.Navigator>
  );
}
