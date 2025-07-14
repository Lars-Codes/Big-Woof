import { ChartNoAxesCombined } from 'lucide-react-native';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectClientStats } from '../../../state/clientDetails/clientDetailsSlice';

export default function ClientStatsList() {
  const stats = useSelector(selectClientStats);

  if (!stats) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-500 font-hn-medium">
          Loading stats...
        </Text>
      </View>
    );
  }

  const {
    payment_methods,
    added_cost_per_service,
    added_cost_travel,
    added_cost_other,
    added_time_per_service,
    added_time_other,
  } = stats;

  const hasAnyData =
    payment_methods.length > 0 ||
    added_cost_per_service.length > 0 ||
    added_cost_travel.length > 0 ||
    added_cost_other.length > 0 ||
    added_time_per_service.length > 0 ||
    added_time_other.length > 0;

  if (!hasAnyData) {
    return (
      <View className="flex-1 justify-center items-center mb-20">
        <ChartNoAxesCombined size={48} color="#D1D5DB" />
        <Text className="text-lg font-hn-medium mt-4 text-center">
          No Stats
        </Text>
        <Text className="text-sm font-hn-regular text-gray-800 mt-2 text-center">
          Create appointments to see stats here
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Added Cost Per Service */}
      {added_cost_per_service.length > 0 && (
        <View className="bg-white rounded-lg p-4 mt-4 mb-2">
          <Text className="text-2xl font-hn-bold text-gray-800 mb-3">
            Additional Service Costs
          </Text>
          {added_cost_per_service.map((cost) => (
            <View key={cost.id} className="mb-3 border-b border-gray-200 pb-2">
              <Text className="text-lg font-hn-bold text-gray-800 mb-1">
                {cost.service_name}
              </Text>
              <Text className="text-base font-hn-regular text-gray-600 mb-1">
                Additional Cost: ${cost.added_cost}{' '}
                {cost.is_percentage ? '(%)' : ''}
              </Text>
              {cost.reason && (
                <Text className="text-sm font-hn-regular text-gray-500 italic">
                  Reason: {cost.reason}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Added Cost Travel */}
      {added_cost_travel.length > 0 && (
        <View className="bg-white rounded-lg p-4 mb-2">
          <Text className="text-2xl font-hn-bold text-gray-800 mb-3">
            Travel Costs
          </Text>
          {added_cost_travel.map((cost) => (
            <View key={cost.id} className="mb-3 border-b border-gray-200 pb-2">
              <Text className="text-base font-hn-regular text-gray-600 mb-1">
                Cost per Mile: ${cost.added_cost_per_mile}{' '}
                {cost.is_percentage ? '(%)' : ''}
              </Text>
              {cost.reason && (
                <Text className="text-sm font-hn-regular text-gray-500 italic">
                  Reason: {cost.reason}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Added Cost Other */}
      {added_cost_other.length > 0 && (
        <View className="bg-white rounded-lg p-4 mb-2">
          <Text className="text-2xl font-hn-bold text-gray-800 mb-3">
            Other Additional Costs
          </Text>
          {added_cost_other.map((cost) => (
            <View key={cost.id} className="mb-3 border-b border-gray-200 pb-2">
              <Text className="text-base font-hn-regular text-gray-600 mb-1">
                Additional Cost: ${cost.added_cost}{' '}
                {cost.is_percentage ? '(%)' : ''}
              </Text>
              {cost.reason && (
                <Text className="text-sm font-hn-regular text-gray-500 italic">
                  Reason: {cost.reason}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Added Time Per Service */}
      {added_time_per_service.length > 0 && (
        <View className="bg-white rounded-lg p-4 mb-2">
          <Text className="text-2xl font-hn-bold text-gray-800 mb-3">
            Additional Service Time
          </Text>
          {added_time_per_service.map((time, index) => (
            <View key={index} className="mb-3 border-b border-gray-200 pb-2">
              <Text className="text-lg font-hn-bold text-gray-800 mb-1">
                {time.service_name}
              </Text>
              <Text className="text-base font-hn-regular text-gray-600 mb-1">
                Additional Time: {time.additional_time} {time.time_type}
              </Text>
              {time.reason && (
                <Text className="text-sm font-hn-regular text-gray-500 italic">
                  Reason: {time.reason}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Added Time Other */}
      {added_time_other.length > 0 && (
        <View
          className={`bg-white rounded-lg p-4 ${added_time_other.length > 0 ? 'mb-4' : 'mb-2'}`}
        >
          <Text className="text-2xl font-hn-bold text-gray-800 mb-3">
            Other Additional Time
          </Text>
          {added_time_other.map((time, index) => (
            <View key={index} className="mb-3 border-b border-gray-200 pb-2">
              <Text className="text-base font-hn-regular text-gray-600 mb-1">
                Additional Time: {time.additional_time} {time.time_type}
              </Text>
              {time.reason && (
                <Text className="text-sm font-hn-regular text-gray-500 italic">
                  Reason: {time.reason}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
