import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import ClientAppointmentsList from './ClientAppointmentsList';
import ClientDocumentsList from './ClientDocumentsList';
import ClientECList from './ClientECList';
import ClientPetsList from './ClientPetsList';
import ClientStatsList from './ClientStatsList';
import ClientVetsList from './ClientVetsList';
import { selectClientSelectedInfo } from '../../../state/clientDetails/clientDetailsSlice';

export default memo(function ClientDetailsInfoDisplay() {
  const selectedInfo = useSelector(selectClientSelectedInfo);

  const renderContent = () => {
    switch (selectedInfo) {
      case 'pets':
        return <ClientPetsList />;
      case 'vets':
        return <ClientVetsList />;
      case 'appointments':
        return <ClientAppointmentsList />;
      case 'documents':
        return <ClientDocumentsList />;
      case 'extra':
        return <ClientECList />;
      case 'statistics':
        return <ClientStatsList />;
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
