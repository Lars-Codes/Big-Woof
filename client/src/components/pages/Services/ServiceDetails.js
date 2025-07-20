import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { selectSelectedService } from '../../../state/services/servicesSlice';
import ServiceDetailsHeader from '../../organisms/ServiceDetails/ServiceDetailsHeader';
import ServiceDetailsInfoDisplay from '../../organisms/ServiceDetails/ServiceDetailsInfoDisplay';
import ServiceDetailsInfoSelector from '../../organisms/ServiceDetails/ServiceDetailsInfoSelector';

export default function ServiceDetails() {
  const service = useSelector(selectSelectedService);

  if (!service) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-500 font-hn-medium">
          No service selected.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {!service ? (
        <Text className="text-lg text-gray-500 mt-6">
          No service data available.
        </Text>
      ) : (
        <View className="flex-1 mt-28">
          <View className="flex-row h-22 px-4">
            <ServiceDetailsHeader />
          </View>

          <ServiceDetailsInfoSelector />

          <View className="flex-1 px-4">
            <ServiceDetailsInfoDisplay />
          </View>
        </View>
      )}
    </View>
  );
}
