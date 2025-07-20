import { CirclePlus } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setClientDetails } from '../../../../../state/clientDetails/clientDetailsSlice';
import * as ClientSlice from '../../../../../state/clients/clientsSlice';
import { selectListType } from '../../../../../state/list/listSlice';
import { setPetDetails } from '../../../../../state/petDetails/petDetailsSlice';
import * as PetsSlice from '../../../../../state/pets/petsSlice';

export default function ListHeaderRight({ navigation }) {
  const dispatch = useDispatch();
  const clientDeleteMode = useSelector(ClientSlice.selectDeleteMode);
  const petDeleteMode = useSelector(PetsSlice.selectDeleteMode);
  const deleteMode = clientDeleteMode || petDeleteMode;

  // Use the actual list type from state instead of prop
  const listType = useSelector(selectListType);

  const clients = useSelector(ClientSlice.selectClients);
  const pets = useSelector(PetsSlice.selectPets);

  const clientCount = clients.length;
  const petCount = pets.length;

  const handleClick = () => {
    if (listType === 'Pets') {
      // Navigate to pet form or handle pet creation
      dispatch(setPetDetails(null));
      navigation.navigate('PetForm');
    } else {
      // set client details to null
      dispatch(setClientDetails(null));
      navigation.navigate('ClientForm');
    }
  };

  return !deleteMode ? (
    <TouchableOpacity
      className="w-32 flex-row justify-end items-center"
      onPress={() => handleClick()}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.7}
    >
      <CirclePlus size={28} color="#000" />
    </TouchableOpacity>
  ) : (
    <View className="w-32 flex-row justify-end items-center">
      <Text className="text-2xl font-hn-medium text-black">
        {listType === 'Pets' ? `${petCount} Pets` : `${clientCount} Clients`}
      </Text>
    </View>
  );
}
