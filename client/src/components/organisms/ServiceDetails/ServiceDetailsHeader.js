import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { selectSelectedService } from '../../../state/services/servicesSlice';

export default function ServiceDetailsHeader() {
  const service = useSelector(selectSelectedService);

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

  return (
    <View className="flex-1 px-4 py-2">
      {/* Service Title & Description */}
      <View className="items-center mb-8">
        <Text className="text-3xl font-hn-bold text-gray-800 text-center mb-3">
          {service.service_name}
        </Text>
        {service.description && (
          <Text className="text-base font-hn-regular text-gray-600 text-center leading-6 px-4 max-w-sm">
            {service.description}
          </Text>
        )}
      </View>

      {/* Service Stats */}
      <View className="flex-row justify-between items-center mb-8 px-2">
        {/* Price Range */}
        <View className="items-center">
          <Text className="text-2xl font-hn-bold text-gray-800 mb-1">
            {getPriceRange(service.service_costs)}
          </Text>
          <Text className="text-xs font-hn-medium text-gray-500 uppercase tracking-wider">
            Price Range
          </Text>
        </View>

        {/* Separator */}
        <View className="w-px h-8 bg-gray-200" />

        {/* Options */}
        <View className="items-center">
          <Text className="text-2xl font-hn-bold text-gray-800 mb-1">
            {service.service_costs ? service.service_costs.length : 0}
          </Text>
          <Text className="text-xs font-hn-medium text-gray-500 uppercase tracking-wider">
            Options
          </Text>
        </View>

        {/* Separator */}
        <View className="w-px h-8 bg-gray-200" />

        {/* Add-ons */}
        <View className="items-center">
          <Text className="text-2xl font-hn-bold text-gray-800 mb-1">
            {service.service_additions ? service.service_additions.length : 0}
          </Text>
          <Text className="text-xs font-hn-medium text-gray-500 uppercase tracking-wider">
            Add-ons
          </Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        className="bg-blue-500 rounded-xl py-4 px-6"
        activeOpacity={0.7}
      >
        <Text className="text-white font-hn-bold text-center text-lg">
          Book This Service
        </Text>
      </TouchableOpacity>
    </View>
  );
}
