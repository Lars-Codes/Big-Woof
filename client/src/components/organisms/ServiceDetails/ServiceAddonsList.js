import React from 'react';
import { Text, View } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchServicesAction } from '../../../sagas/services/fetchServices/action';
import { useSelector } from 'react-redux';
import { selectSelectedService } from '../../../state/services/servicesSlice';
import MiniList from '../../molecules/List/MiniList';

export default function ServiceAddonsList() {
  //   const dispatch = useDispatch();
  const service = useSelector(selectSelectedService);

  const handleAddAddon = () => {
    console.log('Add Add-on button pressed');
  };

  const renderAddonItem = (addon) => (
    <>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-hn-medium text-gray-800">
          {addon.reason}
        </Text>
        <Text className="text-base font-hn-bold text-green-600">
          +${parseFloat(addon.service_addition_added_cost).toFixed(2)}
        </Text>
      </View>
      {addon.description && (
        <Text className="text-sm font-hn-regular text-gray-600">
          {addon.description}
        </Text>
      )}
    </>
  );

  return (
    <MiniList
      data={service?.service_additions}
      renderItem={renderAddonItem}
      itemClickable={false}
      //   onRefresh={() => {
      //     dispatch(fetchServicesAction(false));
      //   }}
      onAddPress={handleAddAddon}
      addButtonText="Add Add-on"
    />
  );
}
