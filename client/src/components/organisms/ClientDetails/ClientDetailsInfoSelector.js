import React, { memo } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelector from '../../../components/atoms/CustomSelector/CustomSelector';
import {
  selectClientSelectedInfo,
  setClientSelectedInfo,
} from '../../../state/clientDetails/clientDetailsSlice';

export default memo(function ClientDetailsInfoSelector() {
  const dispatch = useDispatch();
  const selectedOption = useSelector(selectClientSelectedInfo);

  const infoOptions = [
    { label: 'Pets', value: 'pets' },
    { label: 'Vets', value: 'vets' },
    { label: 'Stats', value: 'statistics' },
    { label: 'Appt.', value: 'appointments' },
    { label: 'Docs', value: 'documents' },
    { label: 'Extra', value: 'extra' },
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
          dispatch(setClientSelectedInfo(value));
        }}
      />
    </View>
  );
});
