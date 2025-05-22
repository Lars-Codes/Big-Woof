import { X } from 'lucide-react-native';
import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';

export default function ClientSearch(props) {
  const { searchStr, handleClientSearch } = props;

  return (
    <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
      <TextInput
        className="flex-1 h-6 w-full"
        placeholder="Search"
        value={searchStr}
        onChangeText={handleClientSearch}
        placeholderTextColor="#888"
      />
      {searchStr.length > 0 && (
        <TouchableOpacity onPress={() => handleClientSearch('')}>
          <X size={20} color="#888" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      )}
    </View>
  );
}
