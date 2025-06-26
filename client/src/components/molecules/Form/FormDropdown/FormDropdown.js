import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
import { SearchBar } from 'react-native-elements';
import CustomDropdown from '../../../atoms/CustomDropdown/CustomDropdown';

const FormDropdown = forwardRef(
  (
    {
      label,
      options,
      selectedOption,
      onSelect,
      onAfterSelect,
      placeholder = 'Select an option',
      required = false,
      disabled = false,
      showEditButton = false,
      handleAdd,
      handleDelete,
      error = false,
      errorMessage = '',
    },
    ref,
  ) => {
    const getDisplayText = () => {
      if (typeof options[0] === 'object' && options[0]?.label) {
        const selectedItem = options.find(
          (option) => option.value == selectedOption,
        );
        return selectedItem ? selectedItem.label : placeholder;
      }
      return selectedOption || placeholder;
    };

    const onAdd = () => {
      handleAdd && handleAdd();
    };

    const onDelete = (selectedOptionData) => {
      handleDelete && handleDelete(selectedOptionData);
    };

    const isShowingPlaceholder = !selectedOption;

    return (
      <CustomDropdown
        ref={ref}
        options={options}
        selectedOption={selectedOption}
        onSelect={onSelect}
        onAfterSelect={onAfterSelect}
        placeholder={placeholder}
        title={label}
        disabled={disabled}
        showEditButton={showEditButton}
        handleAdd={onAdd}
        handleDelete={onDelete}
      >
        <View className="mb-4">
          {label && (
            <View className="flex-row items-baseline mb-1">
              <Text className="text-xl font-hn-medium">
                {label}
                {required ? ' *' : ''}
              </Text>
            </View>
          )}
          <SearchBar
            placeholder={placeholder}
            lightTheme
            round
            value={getDisplayText()}
            editable={false}
            pointerEvents="none"
            containerStyle={{
              backgroundColor: 'transparent',
              borderTopWidth: 0,
              borderBottomWidth: 0,
              paddingHorizontal: 0,
              paddingVertical: 0,
            }}
            inputContainerStyle={{
              backgroundColor: error ? '#FEE2E2' : '#f0f0f0',
              height: 35,
              borderColor: error ? '#EF4444' : 'transparent',
              borderWidth: error ? 1 : 0,
            }}
            inputStyle={{
              fontFamily: 'hn-regular',
              fontSize: 16,
              color: isShowingPlaceholder ? '#9CA3AF' : '#333',
            }}
            searchIcon={false}
            clearIcon={false}
          />
          {error && errorMessage && (
            <Text className="text-red-500 text-sm mt-1 ml-2">
              {errorMessage}
            </Text>
          )}
        </View>
      </CustomDropdown>
    );
  },
);

FormDropdown.displayName = 'FormDropdown';

export default FormDropdown;
