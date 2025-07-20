import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServicesAction } from '../../../sagas/services/fetchServices/action';
import {
  selectServices,
  selectAppointmentFees,
  selectStandaloneAdditions,
  setSelectedService,
  selectLoading,
} from '../../../state/services/servicesSlice';

export default function ServicesList() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const services = useSelector(selectServices);
  const appointmentFees = useSelector(selectAppointmentFees);
  const standaloneAdditions = useSelector(selectStandaloneAdditions);
  const loading = useSelector(selectLoading);

  const handleRefresh = useCallback(() => {
    dispatch(fetchServicesAction());
  }, [dispatch]);

  // Helper function to get price range from service_costs
  const getPriceRange = (serviceCosts) => {
    if (!serviceCosts || serviceCosts.length === 0) return null;

    const prices = serviceCosts.map((cost) => parseFloat(cost.service_cost));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return minPrice === maxPrice
      ? `$${minPrice.toFixed(2)}`
      : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
  };

  // Helper function to get number of breed variations
  const getBreedCount = (serviceCosts) => {
    if (!serviceCosts || serviceCosts.length === 0) return 0;
    return serviceCosts.length;
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      className="flex-1 m-2 p-4 bg-white rounded-xl"
      activeOpacity={0.7}
      onPress={() => {
        dispatch(setSelectedService(item));
        navigation.navigate('ServiceDetails');
      }}
    >
      <View className="items-center min-h-[140px]">
        {/* Service Name */}
        <Text className="text-lg font-hn-bold text-gray-800 text-center">
          {item.service_name}
        </Text>

        {/* Description */}
        {item.description && (
          <Text
            className="text-sm font-hn-regular text-gray-500 text-center mt-2 flex-1"
            numberOfLines={3}
          >
            {item.description}
          </Text>
        )}

        {/* Price Range */}
        {item.service_costs && (
          <Text className="text-lg font-hn-medium text-blue-600 mt-2">
            {getPriceRange(item.service_costs)}
          </Text>
        )}

        {/* Additional Info */}
        <View className="flex-row justify-between w-full mt-2">
          {/* Breed Variations */}
          {item.service_costs && (
            <Text className="text-xs font-hn-regular text-gray-400">
              {getBreedCount(item.service_costs)} variations
            </Text>
          )}

          {/* Service Additions */}
          {item.service_additions && item.service_additions.length > 0 && (
            <Text className="text-xs font-hn-regular text-gray-400">
              +{item.service_additions.length} add-ons
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAppointmentFees = () => (
    <View className="mx-4 mb-6 mt-2">
      <Text className="text-xl font-hn-bold text-gray-800 mb-3">
        Appointment Fees
      </Text>
      <View className="bg-white rounded-lg p-4">
        {appointmentFees.map((fee) => (
          <View
            key={fee.fee_id}
            className="flex-row justify-between items-center py-2"
          >
            <Text className="text-base font-hn-regular text-gray-700">
              {fee.reason}
            </Text>
            <Text className="text-base font-hn-medium text-gray-800">
              ${parseFloat(fee.fee).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderStandaloneAdditions = () => (
    <View className="mx-4 mb-6">
      <Text className="text-xl font-hn-bold text-gray-800 mb-3">
        Standalone Add-ons
      </Text>
      <View className="bg-white rounded-lg p-4">
        {standaloneAdditions.map((addition, index) => (
          <View key={index} className="py-3">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-base font-hn-medium text-gray-800">
                {addition.reason}
              </Text>
              <Text className="text-base font-hn-bold text-blue-600">
                +${parseFloat(addition.service_addition_added_cost).toFixed(2)}
              </Text>
            </View>
            {addition.description && (
              <Text className="text-sm font-hn-regular text-gray-500">
                {addition.description}
              </Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderServicesHeader = () => (
    <View className="mx-4 mb-4">
      <Text className="text-xl font-hn-bold text-gray-800">Services</Text>
    </View>
  );

  if (loading && services.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 mt-28">
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.service_name}
        numColumns={2}
        onRefresh={handleRefresh}
        refreshing={loading}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{
          paddingBottom: 32,
        }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
        ListHeaderComponent={() => (
          <View>
            {appointmentFees.length > 0 && renderAppointmentFees()}
            {standaloneAdditions.length > 0 && renderStandaloneAdditions()}
            {services.length > 0 && renderServicesHeader()}
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center min-h-80">
            <Text className="text-lg text-gray-500 font-hn-medium">
              No services available.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
