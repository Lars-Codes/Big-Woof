import { Check } from 'lucide-react-native';
import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';

export default memo(function CustomCheckbox({
  value,
  onValueChange,
  className,
}) {
  return (
    <TouchableOpacity
      className={`w-6 h-6 rounded-full border-2 ${
        value ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
      } items-center justify-center ${className}`}
      onPress={onValueChange}
      activeOpacity={0.7}
    >
      {value && <Check size={16} color="white" />}
    </TouchableOpacity>
  );
});
