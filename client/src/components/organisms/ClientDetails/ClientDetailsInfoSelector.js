import SegmentedControl from '@react-native-segmented-control/segmented-control';
import React, { memo } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
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
      <SegmentedControl
        values={infoOptions.map((option) => option.label)}
        selectedIndex={selectedIndex}
        onChange={(event) => {
          const index = event.nativeEvent.selectedSegmentIndex;
          dispatch(setClientSelectedInfo(infoOptions[index].value));
        }}
        style={{ flex: 1, height: 48 }}
        fontStyle={{ fontFamily: 'hn-medium', fontSize: 16, color: '#000' }}
        tintColor="#FFF"
      />
    </View>
  );
});
