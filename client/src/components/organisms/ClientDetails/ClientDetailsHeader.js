import { useActionSheet } from '@expo/react-native-action-sheet';
import { Pin } from 'lucide-react-native';
import React from 'react';
import { View, Text, Image, Linking, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectClientDetails,
  selectClientFavorite,
  selectClientProfilePicture,
} from '../../../state/clientDetails/clientDetailsSlice';
import { formatPhoneNumber } from '../../../utils/helpers/phoneNumberUtil';

export default function ClientDetailsHeader() {
  const client = useSelector(selectClientDetails);
  const clientProfilePicture = useSelector(selectClientProfilePicture);
  const clientFavorite = useSelector(selectClientFavorite);
  const { showActionSheetWithOptions } = useActionSheet();

  const handlePhonePress = () => {
    const phoneNumber = client.client_contact.primary_phone;
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const options = ['Call', 'Text', 'Cancel'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: formattedPhone,
        tintColor: '#007AFF',
        containerStyle: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        },
        textStyle: {
          fontSize: 18,
        },
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0: // Call
            Linking.openURL(`tel:${cleanPhone}`);
            break;
          case 1: // Text
            Linking.openURL(`sms:${cleanPhone}`);
            break;
          case 2: // Cancel
            // Do nothing
            break;
        }
      },
    );
  };

  const handleAddressPress = () => {
    const { street_address, city, state, zip } = client.client_contact;
    const fullAddress = `${street_address}, ${city}, ${state} ${zip}`;
    const encodedAddress = encodeURIComponent(fullAddress);

    // This will open the default maps app on both iOS and Android
    const mapsUrl = `maps:0,0?q=${encodedAddress}`;

    Linking.openURL(mapsUrl).catch(() => {
      // Fallback for Android or if maps: doesn't work
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      Linking.openURL(googleMapsUrl);
    });
  };

  const handleEmailPress = () => {
    const email = client.client_contact.email;
    if (email) {
      Linking.openURL(`mailto:${email}`).catch((err) => {
        console.error('Failed to open email:', err);
      });
    } else {
      console.warn('No email address available');
    }
  };

  if (!client) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-500 font-hn-medium">
          No client data available.
        </Text>
      </View>
    );
  }

  const renderProfilePicture = () => {
    const imageUri = clientProfilePicture?.startsWith('data:')
      ? clientProfilePicture
      : `data:image/jpeg;base64,${clientProfilePicture}`;

    return (
      <Image
        source={{ uri: imageUri }}
        className="w-[100px] h-[100px] rounded-full"
      />
    );
  };

  return (
    <View className="flex-row flex-1">
      <View className="w-[35%] justify-center items-center">
        {renderProfilePicture()}
      </View>
      <View className="w-[65%] p-4 justify-center">
        <View className="flex-row items-center h-8">
          <Text className="text-3xl text-gray-800 font-hn-bold">
            {client.client_data.fname} {client.client_data.lname}
          </Text>
          {clientFavorite && (
            <View className="ml-2">
              <Pin size={16} color="#000" fill="#999" />
            </View>
          )}
        </View>

        <View className="flex-col h-22">
          <View className="flex-row h-5">
            <TouchableOpacity onPress={handlePhonePress} onLongPress={() => {}}>
              <Text
                className="text-base font-hn-regular text-blue-600"
                selectable={true}
              >
                {formatPhoneNumber(client.client_contact.primary_phone)}
              </Text>
            </TouchableOpacity>
          </View>

          {client.client_contact.email && (
            <View className="flex-row h-5 mb-1">
              <TouchableOpacity
                onPress={handleEmailPress}
                onLongPress={() => {}}
              >
                <Text
                  className="text-base font-hn-regular text-blue-600 flex-1"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  selectable={true}
                >
                  {client.client_contact.email}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {client.client_contact.street_address &&
            client.client_contact.city &&
            client.client_contact.state &&
            client.client_contact.zip && (
              <View className="flex-row h-10">
                <TouchableOpacity
                  onPress={handleAddressPress}
                  onLongPress={() => {}}
                  selectable={true}
                >
                  <Text
                    className="text-base font-hn-regular text-blue-600 flex-1"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    selectable={true}
                  >
                    {client.client_contact.street_address}
                    {'\n'}
                    {client.client_contact.city}, {client.client_contact.state}{' '}
                    {client.client_contact.zip}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
        </View>
      </View>
    </View>
  );
}
