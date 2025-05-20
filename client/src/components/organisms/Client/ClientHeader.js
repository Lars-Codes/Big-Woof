import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClientHeader() {
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={['top']} className="bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View className="flex-row items-center px-4 h-[56px]">
        {navigation.canGoBack() && (
          <TouchableOpacity
            className="mr-2 p-2" // Added padding for larger touch target
            onPress={() => {
              navigation.goBack();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color="#000" />
          </TouchableOpacity>
        )}
        <Text className="text-xl font-lexend-semibold" numberOfLines={1}>
          Client Header
        </Text>
      </View>
    </SafeAreaView>
  );
}
