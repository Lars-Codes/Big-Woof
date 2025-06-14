import { Hospital } from 'lucide-react-native';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectClientDetails } from '../../../state/clientDetails/clientDetailsSlice';

export default function ClientVetsList() {
  const client = useSelector(selectClientDetails);
  const vets = client?.client_vets || [];

  if (!vets || vets.length === 0) {
    return (
      <View className="flex-1 justify-center items-center mb-20">
        <Hospital size={48} color="#D1D5DB" />
        <Text className="text-lg font-hn-medium mt-4 text-center">No Vets</Text>
        <Text className="text-sm font-hn-regular text-gray-800 mt-2 text-center">
          Add vets to see them here
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {vets.map((vet, index) => (
        <View
          key={index}
          className={`bg-white rounded-lg p-4 ${
            index === 0 ? 'mt-4' : 'mt-2'
          } ${index === vets.length - 1 ? 'mb-4' : 'mb-2'}`}
        >
          <Text className="text-2xl font-hn-bold mb-2">
            Dr. {vet.fname} {vet.lname}
          </Text>

          <View className="flex-row mb-1">
            <View className="flex-1 pr-2">
              <Text className="text-lg font-hn-medium ">Contact:</Text>
              <Text className="text-base font-hn-regular">{vet.email}</Text>
              <Text className="text-base font-hn-regular">
                {vet.primary_phone}
              </Text>
              {vet.secondary_phone && (
                <Text className="text-base font-hn-regular ">
                  {vet.secondary_phone}
                </Text>
              )}
            </View>

            <View className="flex-1 pl-2">
              <Text className="text-lg font-hn-medium ">Address:</Text>
              <Text className="text-base font-hn-regular">
                {vet.street_address}
              </Text>
              <Text className="text-base font-hn-regular">
                {vet.city}, {vet.state} {vet.zip}
              </Text>
            </View>
          </View>

          {vet.notes && (
            <View>
              <Text className="text-lg font-hn-medium">Notes:</Text>
              <Text className="text-base font-hn-regular text-gray-700 italic">
                {vet.notes}
              </Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
