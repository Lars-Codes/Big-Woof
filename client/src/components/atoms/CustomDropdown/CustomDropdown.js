import { useActionSheet } from '@expo/react-native-action-sheet';
import { Picker } from '@react-native-picker/picker';
import * as Haptics from 'expo-haptics';
import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';

const CustomDropdown = forwardRef(
  (
    {
      options,
      selectedOption,
      onSelect,
      onAfterSelect,
      placeholder = 'Select an option',
      title,
      disabled = false,
      showEditButton = false,
      handleAdd,
      handleDelete,
      children,
    },
    ref,
  ) => {
    const actionSheetRef = useRef(null);
    const [tempSelectedValue, setTempSelectedValue] = useState(selectedOption);
    const { showActionSheetWithOptions } = useActionSheet();

    useEffect(() => {
      setTempSelectedValue(selectedOption);
    }, [selectedOption]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        setTimeout(() => {
          actionSheetRef.current?.show();
        }, 100);
      },
    }));

    const handleTempSelect = (itemValue) => {
      setTempSelectedValue(itemValue);
    };

    const handleDoneClick = () => {
      // Trigger haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      if (tempSelectedValue !== null && tempSelectedValue !== undefined) {
        onSelect(tempSelectedValue);
      }
      actionSheetRef.current?.hide();

      if (onAfterSelect) {
        setTimeout(() => {
          onAfterSelect();
        }, 300);
      }
    };

    const handleEditClick = () => {
      // Find the selected option to get both value and label
      const selectedOptionData = options.find((option) => {
        if (typeof option === 'object' && option.value !== undefined) {
          return option.value === tempSelectedValue;
        }
        return option === tempSelectedValue;
      });

      const isDataAvailable =
        selectedOptionData &&
        tempSelectedValue !== null &&
        tempSelectedValue !== undefined;

      showActionSheetWithOptions(
        {
          options: ['Add', 'Delete', 'Cancel'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
          disabledButtonIndices: isDataAvailable ? [] : [1],
          tintColor: '#007AFF',
          containerStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          },
          textStyle: {
            fontSize: 18,
          },
        },
        (selectedIndex) => {
          switch (selectedIndex) {
            case 0:
              handleAdd && handleAdd();
              break;
            case 1:
              handleDelete && handleDelete(selectedOptionData);
              break;
            case 2:
              break;
          }
        },
      );
    };

    const openActionSheet = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (!disabled) {
        setTempSelectedValue(selectedOption);
        actionSheetRef.current?.show();
      }
    };

    return (
      <>
        <TouchableOpacity
          onPress={openActionSheet}
          disabled={disabled}
          activeOpacity={0.7}
        >
          {children}
        </TouchableOpacity>

        <ActionSheet
          ref={actionSheetRef}
          containerStyle={{
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
          indicatorStyle={{
            width: 40,
          }}
          gestureEnabled={false}
          defaultOverlayOpacity={0.3}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center px-6 pt-4">
            <View className="flex-1">
              {showEditButton && (
                <TouchableOpacity onPress={handleEditClick}>
                  <Text className="text-2xl font-hn-medium text-blue-500">
                    Edit
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View className="flex">
              <Text className="text-2xl font-hn-bold text-gray-800 text-center">
                {title}
              </Text>
            </View>
            <View className="flex-1">
              <TouchableOpacity onPress={handleDoneClick} className="items-end">
                <Text className="text-2xl font-hn-medium text-blue-500">
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Picker
            selectedValue={tempSelectedValue}
            onValueChange={handleTempSelect}
          >
            <Picker.Item label={placeholder} value={null} color="#9CA3AF" />
            {options.map((option, index) => {
              if (
                typeof option === 'object' &&
                option.label &&
                option.value !== undefined
              ) {
                return (
                  <Picker.Item
                    key={index}
                    label={option.label}
                    value={option.value}
                    color="#4B5563"
                  />
                );
              } else {
                return (
                  <Picker.Item
                    key={index}
                    label={option}
                    value={option}
                    color="#4B5563"
                  />
                );
              }
            })}
          </Picker>
        </ActionSheet>
      </>
    );
  },
);

CustomDropdown.displayName = 'CustomDropdown';

export default CustomDropdown;
