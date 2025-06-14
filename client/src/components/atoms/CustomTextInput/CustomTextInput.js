import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
import { SearchBar } from 'react-native-elements';

const CustomTextInput = forwardRef(
  (
    {
      value,
      onChangeText,
      placeholder,
      label,
      keyboardType = 'default',
      autoCapitalize = 'words',
      multiline = false,
      required = false,
      ...props
    },
    ref,
  ) => {
    return (
      <View className="mb-4">
        {label && (
          <Text className="text-xl font-hn-medium mb-1">
            {label}
            {required ? ' *' : ''}
          </Text>
        )}
        <SearchBar
          ref={ref}
          placeholder={placeholder}
          lightTheme
          round
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          containerStyle={{
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            borderBottomWidth: 0,
            paddingHorizontal: 0,
            paddingVertical: 0,
          }}
          inputContainerStyle={{
            backgroundColor: '#f0f0f0',
            height: 35,
          }}
          inputStyle={{
            fontFamily: 'hn-regular',
            fontSize: 16,
            color: '#333',
          }}
          searchIcon={false}
          clearIcon={false}
          {...props}
        />
      </View>
    );
  },
);

CustomTextInput.displayName = 'CustomTextInput';

export default CustomTextInput;
