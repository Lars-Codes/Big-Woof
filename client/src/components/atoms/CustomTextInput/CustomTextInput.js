import React, { forwardRef } from 'react';
import { View, Text, TextInput } from 'react-native';
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
      numberOfLines = 1,
      required = false,
      error = false,
      errorMessage = '',
      ...props
    },
    ref,
  ) => {
    // Use TextInput for multiline, SearchBar for single line
    if (multiline) {
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
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            multiline={true}
            numberOfLines={numberOfLines}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            textAlignVertical="top"
            style={{
              backgroundColor: error ? '#FEE2E2' : '#f0f0f0',
              borderRadius: 20,
              padding: 12,
              fontFamily: 'hn-regular',
              fontSize: 16,
              color: '#333',
              minHeight: numberOfLines * 20 + 24, // Base height
              borderColor: error ? '#EF4444' : 'transparent',
              borderWidth: error ? 1 : 0,
            }}
            {...props}
          />
        </View>
      );
    }

    // Use SearchBar for single line inputs
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
