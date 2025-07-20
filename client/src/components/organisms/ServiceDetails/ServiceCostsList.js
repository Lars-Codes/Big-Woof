import React from 'react';
import { Text, View } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchServicesAction } from '../../../sagas/services/fetchServices/action';
import { useSelector } from 'react-redux';
import { selectSelectedService } from '../../../state/services/servicesSlice';
import MiniList from '../../molecules/List/MiniList';

export default function ServiceCostsList() {
  //   const dispatch = useDispatch();
  const service = useSelector(selectSelectedService);

  const handleAddCost = () => {
    console.log('Add Cost button pressed');
  };

  const renderCostItem = (cost) => (
    <>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-hn-bold text-blue-600">
          ${parseFloat(cost.service_cost).toFixed(2)}
        </Text>
        <Text className="text-sm font-hn-medium text-gray-600">
          {cost.size_tier}
        </Text>
      </View>
      <View className="space-y-1">
        {cost.breed && (
          <Text className="text-sm font-hn-regular text-gray-700">
            <Text className="font-hn-medium">Breed:</Text> {cost.breed}
          </Text>
        )}
        {cost.coat_type && (
          <Text className="text-sm font-hn-regular text-gray-700">
            <Text className="font-hn-medium">Coat:</Text> {cost.coat_type}
          </Text>
        )}
        {cost.hair_length && (
          <Text className="text-sm font-hn-regular text-gray-700">
            <Text className="font-hn-medium">Hair Length:</Text>{' '}
            {cost.hair_length}
          </Text>
        )}
      </View>
    </>
  );

  return (
    <MiniList
      data={service.service_costs}
      renderItem={renderCostItem}
      itemClickable={false}
      //   onRefresh={() => {
      //     dispatch(fetchServicesAction(false));
      //   }}
      onAddPress={handleAddCost}
      addButtonText="Add Cost"
    />
  );
}
