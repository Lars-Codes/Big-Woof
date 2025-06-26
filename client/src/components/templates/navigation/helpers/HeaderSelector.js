import React, { memo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import CustomSelector from '../../../../components/atoms/CustomSelector/CustomSelector';
import * as ClientSlice from '../../../../state/clients/clientsSlice';
import * as PetsSlice from '../../../../state/pets/petsSlice';

export default memo(function HeaderSelector({
  options,
  selectedOption,
  onSelect,
}) {
  const selectedIndex = options.findIndex(
    (option) => option.value === selectedOption,
  );

  const clientDeleteMode = useSelector(ClientSlice.selectDeleteMode);
  const petDeleteMode = useSelector(PetsSlice.selectDeleteMode);
  const deleteMode = clientDeleteMode || petDeleteMode;

  return (
    <View className="flex-row w-40 justify-center items-center">
      <CustomSelector
        selectedIndex={selectedIndex}
        options={options}
        onSelect={deleteMode ? () => {} : onSelect}
        disabled={deleteMode}
      />
    </View>
  );
});
