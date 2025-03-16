import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { COLORS, SPACING } from '../../styles/theme';
import { NavigationProp } from '@react-navigation/native';

interface AddButtonProps {
  navigation: NavigationProp<any>;
  location: string;
}

const AddButton: React.FC<AddButtonProps> = ({ navigation, location }) => {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={() => {
        navigation.navigate(location);
      }}
      activeOpacity={0.7}
    >
      <Plus color={COLORS.white} size={24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: SPACING.lg,
    bottom: SPACING.lg,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AddButton;