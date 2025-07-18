import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { selectSelectedService } from '../../../state/services/servicesSlice';

export default function ServiceDetails() {
  const selectedService = useSelector(selectSelectedService);

  if (!selectedService) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-500 font-hn-medium">
          No service selected.
        </Text>
      </View>
    );
  }

  // Helper function to get price range from service_costs
  const getPriceRange = (serviceCosts) => {
    if (!serviceCosts || serviceCosts.length === 0)
      return 'Price not available';

    const prices = serviceCosts.map((cost) => parseFloat(cost.service_cost));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return minPrice === maxPrice
      ? `$${minPrice.toFixed(2)}`
      : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
  };

  const renderServiceCosts = () => (
    <View className="mb-6">
      <Text className="text-xl font-hn-bold text-gray-800 mb-3">Pricing</Text>
      <View className="bg-white rounded-lg p-4">
        {selectedService.service_costs &&
        selectedService.service_costs.length > 0 ? (
          selectedService.service_costs.map((cost, index) => (
            <View key={index} className="py-3 border-b border-gray-100">
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
                    <Text className="font-hn-medium">Coat:</Text>{' '}
                    {cost.coat_type}
                  </Text>
                )}
                {cost.hair_length && (
                  <Text className="text-sm font-hn-regular text-gray-700">
                    <Text className="font-hn-medium">Hair Length:</Text>{' '}
                    {cost.hair_length}
                  </Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text className="text-gray-500 font-hn-regular">
            No pricing information available.
          </Text>
        )}
      </View>
    </View>
  );

  const renderServiceAdditions = () => (
    <View className="mb-6">
      <Text className="text-xl font-hn-bold text-gray-800 mb-3">Add-ons</Text>
      <View className="bg-white rounded-lg p-4">
        {selectedService.service_additions &&
        selectedService.service_additions.length > 0 ? (
          selectedService.service_additions.map((addition, index) => (
            <View key={index} className="py-3 border-b border-gray-100">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-base font-hn-medium text-gray-800">
                  {addition.reason}
                </Text>
                <Text className="text-base font-hn-bold text-green-600">
                  +$
                  {parseFloat(addition.service_addition_added_cost).toFixed(2)}
                </Text>
              </View>
              {addition.description && (
                <Text className="text-sm font-hn-regular text-gray-600">
                  {addition.description}
                </Text>
              )}
            </View>
          ))
        ) : (
          <Text className="text-gray-500 font-hn-regular">
            No add-ons available for this service.
          </Text>
        )}
      </View>
    </View>
  );

  const renderServiceSummary = () => (
    <View className="mb-6">
      <Text className="text-xl font-hn-bold text-gray-800 mb-3">
        Service Summary
      </Text>
      <View className="bg-white rounded-lg p-4">
        <View className="flex-row justify-between items-center py-2">
          <Text className="text-base font-hn-medium text-gray-700">
            Price Range
          </Text>
          <Text className="text-base font-hn-bold text-blue-600">
            {getPriceRange(selectedService.service_costs)}
          </Text>
        </View>
        <View className="flex-row justify-between items-center py-2">
          <Text className="text-base font-hn-medium text-gray-700">
            Pricing Options
          </Text>
          <Text className="text-base font-hn-regular text-gray-600">
            {selectedService.service_costs
              ? selectedService.service_costs.length
              : 0}{' '}
            variations
          </Text>
        </View>
        <View className="flex-row justify-between items-center py-2">
          <Text className="text-base font-hn-medium text-gray-700">
            Add-ons Available
          </Text>
          <Text className="text-base font-hn-regular text-gray-600">
            {selectedService.service_additions
              ? selectedService.service_additions.length
              : 0}{' '}
            options
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 mt-28">
      <View className="p-4">
        {/* Service Header */}
        <View className="mb-6">
          <Text className="text-2xl font-hn-bold text-gray-800 mb-2">
            {selectedService.service_name}
          </Text>
          {selectedService.description && (
            <Text className="text-base font-hn-regular text-gray-600 leading-6">
              {selectedService.description}
            </Text>
          )}
        </View>

        {/* Service Summary */}
        {renderServiceSummary()}

        {/* Pricing Section */}
        {renderServiceCosts()}

        {/* Add-ons Section */}
        {renderServiceAdditions()}

        {/* Action Button */}
        <TouchableOpacity className="bg-blue-600 rounded-lg p-4 mt-4">
          <Text className="text-white font-hn-bold text-center text-lg">
            Book This Service
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
