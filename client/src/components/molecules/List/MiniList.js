import { Plus } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';

export default function MiniList({
  data = [],
  renderItem,
  itemClickable = true,
  onRefresh,
  refreshing = false,
  onAddPress,
  addButtonText = 'Add Item',
  scrollViewProps = {},
}) {
  // If there's an empty state component and no data, show it
  if (!data || data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center mb-20">
        <Text className="text-xl font-hn-bold text-center p-2 text-gray-600">
          No items found!
        </Text>

        <TouchableOpacity
          onPress={onAddPress}
          activeOpacity={0.7}
          className="bg-blue-500 px-6 py-3 rounded-lg flex-row items-center"
        >
          <Plus size={20} color="white" />
          <Text className="text-white font-hn-medium ml-2">
            {addButtonText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-300 px-2 pb-2 rounded-xl my-2">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#9ca3af']}
              tintColor="#9ca3af"
            />
          ) : undefined
        }
        {...scrollViewProps}
      >
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            disabled={!itemClickable}
            activeOpacity={0.7}
            className={`bg-white rounded-xl p-4 mx-1 ${
              index === 0 ? 'mt-3' : 'mt-3'
            } ${index === data.length - 1 ? 'mb-3' : ''}`}
          >
            {renderItem(item, index)}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        onPress={onAddPress}
        activeOpacity={0.7}
        className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center justify-center"
      >
        <Plus size={20} color="white" />
        <Text className="text-white font-hn-medium ml-2">{addButtonText}</Text>
      </TouchableOpacity>
    </View>
  );
}
