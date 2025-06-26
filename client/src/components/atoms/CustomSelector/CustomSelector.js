import SegmentedControl from '@react-native-segmented-control/segmented-control';
import * as Haptics from 'expo-haptics';
import React from 'react';

export default function CustomSelector({
  selectedIndex,
  options,
  onSelect,
  disabled = false,
}) {
  return (
    <SegmentedControl
      values={options.map((option) => option.label)}
      selectedIndex={selectedIndex}
      onChange={(event) => {
        const index = event.nativeEvent.selectedSegmentIndex;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onSelect(options[index].value);
      }}
      style={{ flex: 1, height: 36 }}
      fontStyle={{ fontFamily: 'hn-medium', fontSize: 16, color: '#000' }}
      tintColor="#FFF"
      enabled={!disabled}
    />
  );
}
