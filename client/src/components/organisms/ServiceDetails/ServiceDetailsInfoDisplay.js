import React, { memo } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import ServiceAddonsList from './ServiceAddonsList';
import ServiceCostsList from './ServiceCostsList';
import { selectSelectedInfo } from '../../../state/services/servicesSlice';

export default memo(function ServicetDetailsInfoDisplay() {
  const selectedInfo = useSelector(selectSelectedInfo);

  const renderContent = () => {
    switch (selectedInfo) {
      case 'costs':
        return <ServiceCostsList />;
      case 'add-ons':
        return <ServiceAddonsList />;
      default:
        return (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg font-hn-medium text-gray-500">
              Select an option above
            </Text>
          </View>
        );
    }
  };

  return <View className="flex-1">{renderContent()}</View>;
});
