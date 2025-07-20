import React, { memo } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelector from '../../../components/atoms/CustomSelector/CustomSelector';
import {
  selectSelectedInfo,
  setSelectedInfo,
} from '../../../state/services/servicesSlice';

export default memo(function ServiceDetailsInfoSelector() {
  const dispatch = useDispatch();
  const selectedOption = useSelector(selectSelectedInfo);

  const infoOptions = [
    { label: 'Costs', value: 'costs' },
    { label: 'Add-ons', value: 'add-ons' },
  ];

  const selectedIndex = infoOptions.findIndex(
    (option) => option.value === selectedOption,
  );

  return (
    <View className="flex-row w-full justify-center items-center px-2">
      <CustomSelector
        selectedIndex={selectedIndex}
        options={infoOptions}
        onSelect={(value) => {
          dispatch(setSelectedInfo(value));
        }}
      />
    </View>
  );
});
