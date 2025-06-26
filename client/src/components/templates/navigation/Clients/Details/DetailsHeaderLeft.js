import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function DetailsHeaderLeft({ navigation }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <ChevronLeft size={32} color="#000" />
    </TouchableOpacity>
  );
}
