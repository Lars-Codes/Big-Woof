import {
  ShieldX,
  Venus,
  Mars,
  CircleSmall,
  ShieldQuestion,
} from 'lucide-react-native';
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updatePetAction } from '../../../sagas/pets/updatePet/action';
import { selectEmployees } from '../../../state/employees/employeesSlice';
import {
  selectPetDetails,
  selectLoading,
  setGender,
} from '../../../state/petDetails/petDetailsSlice';
import CustomDropdown from '../../atoms/CustomDropdown/CustomDropdown';
import PetProfilePicture from '../../atoms/PetProfilePicture/PetProfilePicture';

export default function PetDetails() {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const pet = useSelector(selectPetDetails);
  const employees = useSelector(selectEmployees);
  const scrollViewRef = useRef(null);

  const [notes, setNotes] = useState(pet?.pet_data?.notes || '');

  // Update notes when pet changes
  useEffect(() => {
    setNotes(pet?.pet_data?.notes || '');
  }, [pet?.pet_data?.id, pet?.pet_data?.notes]);

  const handleSaveNotes = () => {
    if (notes !== pet?.pet_data?.notes) {
      const updatedData = { pet_id: pet.pet_data.id, notes: notes };
      dispatch(updatePetAction({ petData: updatedData }));
    }
  };

  const handleNotesChange = (text) => {
    setNotes(text);
  };

  const handleNotesFocus = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
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
      <PetProfilePicture showCameraButton={true}>
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

  const handleSelectGroomer = (item) => {
    const updatedData = { pet_id: pet.pet_data.id, typical_groomer: item };
    dispatch(updatePetAction({ petData: updatedData }));
  };

  const renderGenderIcon = () => {
    const gender = pet.pet_data?.gender;

    const iconSize = 24;
    const iconStyle = {
      position: 'absolute',
      bottom: -2,
      left: -2,
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
    <ScrollView
      ref={scrollViewRef}
      className="flex-1 mt-28"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets={true}
    >
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
          <View className="flex-row items-center gap-1">
            <Text className="text-lg font-hn-medium">Coat Type:</Text>
            <Text className="text-lg font-hn-regular">
              {pet.pet_data?.coat_type || '--'}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-lg font-hn-medium">Hair Length:</Text>
            <Text className="text-lg font-hn-regular">
              {pet.pet_data?.hair_length || '--'}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-lg font-hn-medium">Typical Groomer:</Text>
            <CustomDropdown
              options={employees}
              selectedItem={pet.pet_data?.typical_groomer}
              onSelect={(item) => {
                () => handleSelectGroomer(item);
              }}
              title="Typical Groomer"
              placeholder="Select Groomer"
            >
              <Text className="text-lg font-hn-regular bg-[#f0f0f0] px-2 rounded-full">
                {pet.pet_data?.typical_groomer || 'Not Assigned'}
              </Text>
            </CustomDropdown>
          </View>
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
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-2xl font-hn-bold mb-2">Notes</Text>
          <TextInput
            value={notes}
            onChangeText={handleNotesChange}
            onFocus={handleNotesFocus}
            onBlur={handleSaveNotes}
            placeholder="Add notes about this pet..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            returnKeyType="done"
            onSubmitEditing={() => {
              handleSaveNotes();
            }}
            blurOnSubmit={true}
            className="text-lg font-hn-regular min-h-[100] p-3 "
            style={{
              backgroundColor: '#f0f0f0',
              borderRadius: 20,
              padding: 12,
              fontFamily: 'hn-regular',
              fontSize: 16,
              color: '#333',
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
