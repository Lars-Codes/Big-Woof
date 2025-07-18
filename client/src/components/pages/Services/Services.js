import React from 'react';
import { View } from 'react-native';
// import ListFooter from '../../molecules/List/ListFooter';
import ServicesList from '../../organisms/Services/ServicesList.js';

export default function Services() {
  return (
    <View className="flex-1">
      <ServicesList />
      {/* <View className="absolute bottom-0 left-0 right-0">
        <ListFooter />
      </View> */}
    </View>
  );
}
