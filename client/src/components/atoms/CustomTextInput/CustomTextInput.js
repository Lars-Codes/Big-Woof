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
      error = false,
      errorMessage = '',
      ...props
    },
    ref,
  ) => {
    return (
      <View className="mb-4">
        {label && (
          <View className="flex-row items-baseline mb-1">
            <Text className="text-xl font-hn-medium">
              {label}
              {required ? ' *' : ''}
            </Text>
            {error && errorMessage && (
              <Text className="text-red-500 text-sm font-hn-medium ml-2">
                {errorMessage}
              </Text>
            )}
          </View>
        )}
        <SearchBar
          ref={ref}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
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
