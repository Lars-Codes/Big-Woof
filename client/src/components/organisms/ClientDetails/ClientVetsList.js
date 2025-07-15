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
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Linking,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClientDetailsAction } from '../../../sagas/clients/fetchClientDetails/action';
import { deleteVetAction } from '../../../sagas/vets/deleteVet/action';
import { updateVetAction } from '../../../sagas/vets/updateVet/action';
import {
  selectClientDetails,
  selectClientVets,
  setClientVetDetails,
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
  const scrollViewRef = useRef(null);

  // State to track notes for each vet
  const [vetNotes, setVetNotes] = useState({});
  // Add refs for each TextInput
  const textInputRefs = useRef({});

  // Initialize notes when vets change
  useEffect(() => {
    if (vets) {
      const initialNotes = {};
      vets.forEach((vet) => {
        initialNotes[vet.id] = vet.notes || '';
      });
      setVetNotes(initialNotes);
    }
  }, [vets]);

  const handleSaveVetNotes = (vetId, notes) => {
    const originalNotes = vets.find((vet) => vet.id === vetId)?.notes || '';

    if (notes !== originalNotes) {
      const updatedData = {
        vet_id: vetId,
        notes: notes,
        client_id: clientDetails.client_data.client_id,
      };

      dispatch(
        updateVetAction({
          ...updatedData,
          onSuccess: () => {
            // DON'T refetch here - let the local state persist
            dispatch(
              fetchClientDetailsAction(clientDetails.client_data.client_id),
            );
            // The data will be fresh when the user navigates away and comes back
          },
          onError: (error) => {
            console.error(`Failed to update vet ${vetId} notes:`, error);
            // Revert the local state
            setVetNotes((prev) => ({
              ...prev,
              [vetId]: originalNotes,
            }));
          },
        }),
      );
    }
  };

  const handleNotesChange = (vetId, text) => {
    setVetNotes((prev) => ({
      ...prev,
      [vetId]: text,
    }));
  };

  const handleNotesFocus = (vetId) => {
    // Small delay to ensure keyboard is shown
    setTimeout(() => {
      const inputRef = textInputRefs.current[vetId];
      if (inputRef && scrollViewRef.current) {
        inputRef.measureLayout(scrollViewRef.current, (x, y) => {
          const scrollToY = Math.max(0, y - 215);
          scrollViewRef.current.scrollTo({
            y: scrollToY,
            animated: true,
          });
        });
      }
    }, 100);
  };

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
            handleEditVet(vet);
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
    dispatch(setClientVetDetails(vet));
    navigation.navigate('VetForm');
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
                onSuccess: () => {
                  Alert.alert(
                    'Success',
                    `Dr. ${vet.fname} ${vet.lname} has been deleted.`,
                  );
                },
                onError: (error) => {
                  console.error('Failed to delete vet:', error);
                  Alert.alert(
                    'Error',
                    'Failed to delete vet. Please try again.',
                  );
                },
              }),
            );
          },
        },
      ],
    );
  };

  const handleVetAddressPress = (vet) => {
    const addressParts = [
      vet.street_address,
      vet.city,
      vet.state,
      vet.zip,
    ].filter(Boolean);

    if (addressParts.length === 0) {
      console.warn('No address available for this vet');
      return;
    }

    const fullAddress = addressParts.join(', ');
    const encodedAddress = encodeURIComponent(fullAddress);

    // This will open the default maps app on both iOS and Android
    const mapsUrl = `maps:0,0?q=${encodedAddress}`;

    Linking.openURL(mapsUrl).catch(() => {
      // Fallback for Android or if maps: doesn't work
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      Linking.openURL(googleMapsUrl);
    });
  };

  const handleVetEmailPress = (email) => {
    if (email) {
      Linking.openURL(`mailto:${email}`).catch((err) => {
        console.error('Failed to open email:', err);
      });
    } else {
      console.warn('No email address available');
    }
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
    <View className="flex-1 bg-gray-300 px-2 pb-2 rounded-xl my-2">
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}
        showsVerticalScrollIndicator={false}
      >
        {vets.map((vet, index) => (
          <View
            key={vet.id}
            className={`bg-white rounded-xl p-4 mx-1 ${
              index === 0 ? 'mt-3' : 'mt-3'
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
                <TouchableOpacity
                  onPress={() => handleVetEmailPress(vet.email)}
                  className="flex-row items-center mb-2"
                >
                  <Mail size={16} color="#3B82F6" />
                  <Text className="text-sm font-hn-regular text-blue-600 ml-2">
                    {vet.email}
                  </Text>
                </TouchableOpacity>
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
                <TouchableOpacity
                  onPress={() => handleVetAddressPress(vet)}
                  className="flex-row items-start"
                >
                  <MapPin size={16} color="#3B82F6" className="mt-0.5" />
                  <View className="ml-2 flex-1">
                    {vet.street_address && (
                      <Text className="text-sm font-hn-regular text-blue-600">
                        {vet.street_address}
                      </Text>
                    )}
                    {(vet.city || vet.state || vet.zip) && (
                      <Text className="text-sm font-hn-regular text-blue-600">
                        {[vet.city, vet.state, vet.zip]
                          .filter(Boolean)
                          .join(', ')}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Notes - Now Editable */}
            <Text className="text-base font-hn-bold mb-2">Notes</Text>
            <TextInput
              ref={(ref) => (textInputRefs.current[vet.id] = ref)}
              value={vetNotes[vet.id] || ''}
              onChangeText={(text) => handleNotesChange(vet.id, text)}
              onBlur={() => handleSaveVetNotes(vet.id, vetNotes[vet.id] || '')}
              onFocus={() => handleNotesFocus(vet.id)}
              placeholder="Add notes about this vet..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              returnKeyType="done"
              onSubmitEditing={() => {
                handleSaveVetNotes(vet.id, vetNotes[vet.id] || '');
              }}
              blurOnSubmit={true}
              className="text-sm font-hn-regular min-h-[80]"
              style={{
                backgroundColor: '#f0f0f0',
                borderRadius: 20,
                padding: 12,
                fontFamily: 'hn-regular',
                fontSize: 14,
                color: '#333',
                minHeight: 80,
              }}
            />
          </View>
        ))}
      </ScrollView>

      {/* Add Vet Button */}
      <TouchableOpacity
        onPress={handleAddVet}
        className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center justify-center"
      >
        <Plus size={18} color="white" />
        <Text className="text-white font-hn-medium ml-2">Add Vet</Text>
      </TouchableOpacity>
    </View>
  );
}
