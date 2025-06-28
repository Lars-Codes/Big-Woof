import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/native';
import {
  Hospital,
  Phone,
  Mail,
  MapPin,
  Plus,
  Ellipsis,
} from 'lucide-react-native';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { deleteVetAction } from '../../../sagas/vets/deleteVet/action';
import {
  selectClientDetails,
  selectClientVets,
} from '../../../state/clientDetails/clientDetailsSlice';
import {
  formatPhoneNumber,
  handlePhonePress,
} from '../../../utils/helpers/phoneNumberUtil';

export default function ClientVetsList() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const clientDetails = useSelector(selectClientDetails);
  const vets = useSelector(selectClientVets);
  const { showActionSheetWithOptions } = useActionSheet();

  const handleEdit = (vet) => {
    // action sheet with the options to edit or delete
    const options = ['Edit Vet', 'Delete Vet', 'Cancel'];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            // Edit Vet
            handleEditVet(vet); // Assuming we want to edit the selected vet
            break;
          case 1:
            // Delete Vet
            handleDeleteVet(vet);
            break;
          case 2:
            // Cancel
            break;
        }
      },
    );
  };

  const handleEditVet = (vet) => {
    console.log('Edit vet:', vet);
  };

  const handleDeleteVet = (vet) => {
    Alert.alert(
      'Delete Vet',
      `Are you sure you want to delete Dr. ${vet.fname} ${vet.lname}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(
              deleteVetAction({
                clientId: clientDetails.client_data.client_id,
                vetId: vet.id,
              }),
            );
          },
        },
      ],
    );
  };

  const handleAddVet = () => {
    navigation.navigate('VetForm');
  };

  if (!vets || vets.length === 0) {
    return (
      <View className="flex-1 justify-center items-center mb-20">
        <Hospital size={64} color="#D1D5DB" />
        <Text className="text-xl font-hn-bold mt-4 text-center text-gray-600">
          No Vets Added
        </Text>
        <Text className="text-base font-hn-regular text-gray-500 mt-2 text-center px-8">
          {
            "Add veterinarian information to keep track of your client's pet care providers"
          }
        </Text>

        <TouchableOpacity
          onPress={handleAddVet}
          className="mt-6 bg-blue-500 px-6 py-3 rounded-lg flex-row items-center"
        >
          <Plus size={20} color="white" />
          <Text className="text-white font-hn-medium ml-2">Add First Vet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-300 px-2 pt-2 rounded-xl my-2">
      {/* Add Vet Button */}
      <TouchableOpacity
        onPress={handleAddVet}
        className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center justify-center"
      >
        <Plus size={18} color="white" />
        <Text className="text-white font-hn-medium ml-2">Add Vet</Text>
      </TouchableOpacity>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {vets.map((vet, index) => (
          <View
            key={index}
            className={`bg-white rounded-xl p-4 mx-1 ${
              index === 0 ? 'mt-2' : 'mt-3'
            } ${index === vets.length - 1 ? 'mb-3' : ''}`}
          >
            {/* Header with Actions */}
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1">
                <Text className="text-xl font-hn-bold text-gray-800">
                  Dr. {vet.fname} {vet.lname}
                </Text>
              </View>

              <View className="flex-row space-x-2">
                <TouchableOpacity onPress={() => handleEdit(vet)}>
                  <Ellipsis size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Contact Information */}
            <View className="mb-3">
              <Text className="text-base font-hn-bold  mb-2">
                Contact Information
              </Text>

              {vet.email && (
                <View className="flex-row items-center mb-2">
                  <Mail size={16} color="#6B7280" />
                  <Text className="text-sm font-hn-regular text-gray-600 ml-2">
                    {vet.email}
                  </Text>
                </View>
              )}

              {vet.primary_phone && (
                <TouchableOpacity
                  onPress={() => handlePhonePress(vet.primary_phone)}
                  className="flex-row items-center mb-1"
                >
                  <Phone size={16} color="#3B82F6" />
                  <Text className="text-sm font-hn-regular text-blue-600 ml-2">
                    {formatPhoneNumber(vet.primary_phone)}
                  </Text>
                </TouchableOpacity>
              )}

              {vet.secondary_phone && (
                <TouchableOpacity
                  onPress={() => handlePhonePress(vet.secondary_phone)}
                  className="flex-row items-center"
                >
                  <Phone size={16} color="#3B82F6" />
                  <Text className="text-sm font-hn-regular text-blue-600 ml-2">
                    {formatPhoneNumber(vet.secondary_phone)} (Secondary)
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Address */}
            {(vet.street_address || vet.city || vet.state || vet.zip) && (
              <View className="mb-3">
                <Text className="text-base font-hn-bold  mb-2">Address</Text>
                <View className="flex-row items-start">
                  <MapPin size={16} color="#6B7280" className="mt-0.5" />
                  <View className="ml-2 flex-1">
                    {vet.street_address && (
                      <Text className="text-sm font-hn-regular text-gray-600">
                        {vet.street_address}
                      </Text>
                    )}
                    {(vet.city || vet.state || vet.zip) && (
                      <Text className="text-sm font-hn-regular text-gray-600">
                        {[vet.city, vet.state, vet.zip]
                          .filter(Boolean)
                          .join(', ')}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}

            {/* Notes */}
            {vet.notes && (
              <View className="bg-gray-100 p-3 rounded-lg">
                <Text className="text-base font-hn-bold  mb-1">Notes</Text>
                <Text className="text-sm font-hn-regular text-gray-600 leading-5">
                  {vet.notes}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
