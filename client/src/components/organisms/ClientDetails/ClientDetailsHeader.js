import { Pin, Phone, Mail, MapPin } from 'lucide-react-native';
import React from 'react';
import { View, Text, Linking, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectClientDetails,
  selectClientFavorite,
} from '../../../state/clientDetails/clientDetailsSlice';
import {
  formatPhoneNumber,
  handlePhonePress,
} from '../../../utils/helpers/phoneNumberUtil';
import ClientProfilePicture from '../../atoms/ClientProfilePicture/ClientProfilePicture';

export default function ClientDetailsHeader() {
  const client = useSelector(selectClientDetails);
  const clientFavorite = useSelector(selectClientFavorite);

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

  return (
    <View className="flex-row flex-1">
      <View className="w-[35%] justify-center items-center">
        <ClientProfilePicture />
      </View>
      <View className="w-[65%] p-4 justify-center">
        <View className="flex-row items-center mb-2">
          <Text className="text-3xl text-gray-800 font-hn-bold">
            {client.client_data.fname} {client.client_data.lname}
          </Text>
          {clientFavorite && (
            <View className="ml-2">
              <Pin size={16} color="#000" fill="#999" />
            </View>
          )}
        </View>

        <View className="flex-col">
          <TouchableOpacity
            onPress={() =>
              handlePhonePress(client.client_contact.primary_phone)
            }
            onLongPress={() => {}}
            className="flex-row items-center mb-1"
          >
            <Phone size={16} color="#3B82F6" />
            <Text
              className="text-sm font-hn-regular text-blue-600 ml-2"
              selectable={true}
            >
              {formatPhoneNumber(client.client_contact.primary_phone)}
            </Text>
          </TouchableOpacity>

          {client.client_contact.email && (
            <TouchableOpacity
              onPress={handleEmailPress}
              onLongPress={() => {}}
              className="flex-row items-center mb-1"
            >
              <Mail size={16} color="#3B82F6" />
              <Text
                className="text-sm font-hn-regular text-blue-600 ml-2 flex-1"
                numberOfLines={1}
                ellipsizeMode="tail"
                selectable={true}
              >
                {client.client_contact.email}
              </Text>
            </TouchableOpacity>
          )}

          {client.client_contact.street_address &&
            client.client_contact.city &&
            client.client_contact.state &&
            client.client_contact.zip && (
              <TouchableOpacity
                onPress={handleAddressPress}
                onLongPress={() => {}}
                className="flex-row items-start"
              >
                <MapPin size={16} color="#3B82F6" className="mt-0.5" />
                <View className="ml-2 flex-1">
                  <Text
                    className="text-sm font-hn-regular text-blue-600"
                    selectable={true}
                  >
                    {client.client_contact.street_address}
                  </Text>
                  <Text
                    className="text-sm font-hn-regular text-blue-600"
                    selectable={true}
                  >
                    {client.client_contact.city}, {client.client_contact.state}{' '}
                    {client.client_contact.zip}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
        </View>
      </View>
    </View>
  );
}
