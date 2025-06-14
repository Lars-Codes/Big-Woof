import { BookUser } from 'lucide-react-native';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectClientDetails } from '../../../state/clientDetails/clientDetailsSlice';

export default function ClientECList() {
  const client = useSelector(selectClientDetails);
  const emergencyContacts = client?.emergency_contacts || [];

  if (!emergencyContacts || emergencyContacts.length === 0) {
    return (
      <View className="flex-1 justify-center items-center mb-20">
        <BookUser size={48} color="#D1D5DB" />
        <Text className="text-lg font-hn-medium mt-4 text-center">
          No Emergency Contacts
        </Text>
        <Text className="text-sm font-hn-regular text-gray-800 mt-2 text-center">
          Add emergency contacts to see them here
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {emergencyContacts.map((contact, index) => (
        <View
          key={contact.emergency_contact_id}
          className={`bg-white rounded-lg p-4 ${
            index === 0 ? 'mt-4' : 'mt-2'
          } ${index === emergencyContacts.length - 1 ? 'mb-4' : 'mb-2'}`}
        >
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-2xl font-hn-bold">
              {contact.fname} {contact.lname}
            </Text>
            <View className="bg-blue-100 px-3 py-1 rounded-full">
              <Text className="text-sm font-hn-medium text-blue-800 capitalize">
                {contact.relationship}
              </Text>
            </View>
          </View>

          <View className="flex-row">
            <View className="flex-1 pr-2">
              <Text className="text-lg font-hn-medium">Contact:</Text>
              <Text className="text-base font-hn-regular">{contact.email}</Text>
              <Text className="text-base font-hn-regular">
                {contact.primary_phone}
              </Text>
              {contact.secondary_phone && (
                <Text className="text-base font-hn-regular">
                  {contact.secondary_phone}
                </Text>
              )}
            </View>

            <View className="flex-1 pl-2">
              <Text className="text-lg font-hn-medium">Address:</Text>
              <Text className="text-base font-hn-regular">
                {contact.street_address}
              </Text>
              <Text className="text-base font-hn-regular">
                {contact.city}, {contact.state} {contact.zip}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
