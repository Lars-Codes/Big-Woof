import {
  ShieldX,
  Venus,
  Mars,
  CircleSmall,
  ShieldQuestion,
} from 'lucide-react-native';
import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updatePetAction } from '../../../sagas/pets/updatePet/action';
import {
  selectPetDetails,
  selectLoading,
  setGender,
} from '../../../state/petDetails/petDetailsSlice';
import {
  selectUpdatePetResult,
  setUpdatePetResult,
} from '../../../state/pets/petsSlice';
import CustomDropdown from '../../atoms/CustomDropdown/CustomDropdown';
import PetProfilePicture from '../../atoms/PetProfilePicture/PetProfilePicture';

export default function PetDetails() {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const pet = useSelector(selectPetDetails);
  const updatePetResult = useSelector(selectUpdatePetResult);

  useEffect(() => {
    dispatch(setUpdatePetResult(null));
  }, [updatePetResult, dispatch]);

  const formatFieldName = (key) => {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <View className="flex-1">
        <ActivityIndicator
          size="large"
          color="#4A90E2"
          style={{ marginTop: 32 }}
        />
      </View>
    );
  }

  if (!pet) {
    return (
      <View className="flex-1">
        <Text className="text-lg text-gray-500 mt-6">
          No pet data available.
        </Text>
      </View>
    );
  }

  const renderProfilePicture = () => {
    return (
      <PetProfilePicture>
        {renderGenderIcon()}
        {renderDeceasedIcon()}
      </PetProfilePicture>
    );
  };

  const renderDeceasedIcon = () => {
    const deceased = pet.pet_data?.deceased;

    if (!deceased || deceased === 0) return null;

    const iconSize = 24;
    const iconStyle = {
      position: 'absolute',
      top: -2,
      right: -2,
      backgroundColor: 'white',
      borderRadius: 99,
      padding: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    };

    return (
      <View className="absolute top-0 right-0">
        <View style={iconStyle}>
          <ShieldX size={iconSize} color="#EF4444" />
        </View>
      </View>
    );
  };

  const renderGenderIcon = () => {
    const gender = pet.pet_data?.gender;

    const iconSize = 24;
    const iconStyle = {
      position: 'absolute',
      bottom: -2,
      right: -2,
      backgroundColor: 'white',
      borderRadius: 99,
      padding: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    };

    const handleGenderChange = (newGender) => {
      dispatch(setGender(newGender));
      const updatedData = { pet_id: pet.pet_data.id, gender: newGender };
      dispatch(updatePetAction({ petData: updatedData }));
    };

    const getGenderIcon = (genderValue) => {
      switch (genderValue) {
        case 1:
          return <Mars size={iconSize} color="#3B82F6" />;
        case 2:
          return <Venus size={iconSize} color="#EC4899" />;
        case 3:
          return <CircleSmall size={iconSize} color="#9CA3AF" />;
        default:
          return <ShieldQuestion size={iconSize} color="#9CA3AF" />;
      }
    };

    return (
      <CustomDropdown
        options={[
          { label: 'Male', value: 1 },
          { label: 'Female', value: 2 },
          { label: 'Unknown', value: 3 },
        ]}
        selectedOption={gender}
        onSelect={handleGenderChange}
        placeholder="Select Gender"
        title="Gender"
      >
        <View style={iconStyle}>{getGenderIcon(gender)}</View>
      </CustomDropdown>
    );
  };

  return (
    <ScrollView className="flex-1 mt-28">
      <View className="flex-1 px-4">
        {renderProfilePicture()}

        {/* Pet Name Header */}
        <View className="items-center mb-4">
          <Text className="text-4xl font-hn-bold text-gray-800">
            {pet.pet_data?.name || 'Unknown Pet'}
          </Text>
          <Text className="text-lg text-gray-600">
            {pet.pet_data?.breed || 'Unknown Breed'}
          </Text>
        </View>

        {/* Basic Info Card */}
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-2xl font-hn-bold mb-2">Basic Information</Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-lg font-hn-medium">Age:</Text>
            <Text className="text-lg font-hn-regular">
              {pet.pet_data?.age + ' years' || '0 years'}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-lg font-hn-medium">Weight:</Text>
            <Text className="text-lg font-hn-regular">
              {pet.pet_data?.weight + ' lbs' || '0 lbs'}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-lg font-hn-medium">Size Tier:</Text>
            <Text className="text-lg font-hn-regular">
              {pet.pet_data?.size_tier || '--'}
            </Text>
          </View>
        </View>

        {/* Health Info Card */}
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-2xl font-hn-bold mb-2">Health Information</Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-lg font-hn-medium">Fixed:</Text>
            <Text className="text-lg font-hn-regular">
              {pet.pet_data?.fixed === 1 ? 'Yes' : 'No'}
            </Text>
          </View>
          {pet.pet_data?.deceased === 1 && (
            <View className="flex-row items-center gap-1">
              <Text className="text-lg font-hn-medium">Deceased:</Text>
              <Text className="text-lg font-hn-regular">Yes</Text>
            </View>
          )}
        </View>

        {/* Grooming Info Card */}
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-2xl font-hn-bold mb-2">
            Grooming Information
          </Text>
          {['coat_type', 'hair_length', 'typical_groomer'].map((field) => {
            const value = pet.pet_data?.[field];
            return (
              <View key={field} className="flex-row items-center gap-1">
                <Text className="text-lg font-hn-medium">
                  {formatFieldName(field)}:
                </Text>
                <Text className="text-lg font-hn-regular">{value || '--'}</Text>
              </View>
            );
          })}
        </View>

        {/* Owner Info Card */}
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-2xl font-hn-bold mb-2">Owner Information</Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-lg font-hn-medium">Owner:</Text>
            <Text className="text-lg font-hn-regular">
              {pet.pet_data?.owner_name || '--'}
            </Text>
          </View>
        </View>

        {/* Notes Card */}
        {pet.pet_data?.notes && (
          <View className="bg-gray-50 rounded-lg p-4 mb-4">
            <Text className="text-2xl font-hn-bold mb-2">Notes</Text>
            <Text className="text-lg font-hn-regular">
              {pet.pet_data.notes || 'No notes yet.'}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
