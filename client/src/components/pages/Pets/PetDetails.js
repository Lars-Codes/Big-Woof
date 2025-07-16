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
import { fetchClientDetailsAction } from '../../../sagas/clients/fetchClientDetails/action';
import { fetchPetsAction } from '../../../sagas/pets/fetchPets/action';
import { updatePetAction } from '../../../sagas/pets/updatePet/action';
import { updatePetIsDeceasedAction } from '../../../sagas/pets/updatePetIsDeceased/action';
import { selectClients } from '../../../state/clients/clientsSlice';
import { selectEmployees } from '../../../state/employees/employeesSlice';
import {
  selectPetDetails,
  selectLoading,
  setGender,
  setPetDetails,
} from '../../../state/petDetails/petDetailsSlice';
import {
  selectHairLengths,
  selectCoatTypes,
  selectSizeTiers,
  selectBreeds,
} from '../../../state/pets/petsSlice';
import CustomDropdown from '../../atoms/CustomDropdown/CustomDropdown';
import PetProfilePicture from '../../atoms/PetProfilePicture/PetProfilePicture';

export default function PetDetails() {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const clients = useSelector(selectClients);
  const pet = useSelector(selectPetDetails);
  const origPetOwnerId = pet?.pet_data?.owner_id || null;
  const breeds = useSelector(selectBreeds);
  const hairLengths = useSelector(selectHairLengths);
  const coatTypes = useSelector(selectCoatTypes);
  const sizeTiers = useSelector(selectSizeTiers);
  const employees = useSelector(selectEmployees);
  const scrollViewRef = useRef(null);

  const clientOptions = clients.map((client) => ({
    label: `${client.fname} ${client.lname}`,
    value: client.client_id,
  }));
  const breedOptions = breeds.map((breed) => ({
    label: breed.breed,
    value: breed.breed_id,
  }));
  const hairLengthsOptions = hairLengths.map((length) => ({
    label: length.length,
    value: length.hair_length_id,
  }));
  const coatTypesOptions = coatTypes.map((coat) => ({
    label: coat.coat_type,
    value: coat.coat_type_id,
  }));
  const sizeTearsOptions = sizeTiers.map((size) => ({
    label: size.size_tier,
    value: size.size_tier_id,
  }));

  const [notes, setNotes] = useState(pet?.pet_data?.notes || '');
  // Add local state for all dropdowns
  const [selectedClient, setSelectedClient] = useState(
    pet?.pet_data?.owner_name || 'Not Assigned',
  );
  const [selectedBreed, setSelectedBreed] = useState(
    pet?.pet_data?.breed || 'Not Assigned',
  );
  const [selectedHairLength, setSelectedHairLength] = useState(
    pet?.pet_data?.hair_length || 'Not Assigned',
  );
  const [selectedCoatType, setSelectedCoatType] = useState(
    pet?.pet_data?.coat_type || 'Not Assigned',
  );
  const [selectedSizeTier, setSelectedSizeTier] = useState(
    pet?.pet_data?.size_tier || 'Not Assigned',
  );
  const [fixed, setFixed] = useState(pet?.pet_data?.fixed || 2);

  // Update all local states when pet changes
  useEffect(() => {
    setNotes(pet?.pet_data?.notes || '');
    setSelectedClient(pet?.pet_data?.owner_name || 'Not Assigned');
    setSelectedBreed(pet?.pet_data?.breed || 'Not Assigned');
    setSelectedHairLength(pet?.pet_data?.hair_length || 'Not Assigned');
    setSelectedCoatType(pet?.pet_data?.coat_type || 'Not Assigned');
    setSelectedSizeTier(pet?.pet_data?.size_tier || 'Not Assigned');
    setFixed(pet?.pet_data?.fixed || 2);
  }, [
    pet?.pet_data?.id,
    pet?.pet_data?.notes,
    pet?.pet_data?.owner_name,
    pet?.pet_data?.breed,
    pet?.pet_data?.hair_length,
    pet?.pet_data?.coat_type,
    pet?.pet_data?.size_tier,
    pet?.pet_data?.fixed,
  ]);

  // Find current IDs for all dropdowns based on local state
  const currentClientId = clients.find(
    (client) => client.fname + ' ' + client.lname === selectedClient,
  )?.client_id;
  const currentBreedId = breeds.find(
    (breed) => breed.breed === selectedBreed,
  )?.breed_id;
  const currentHairLengthId = hairLengths.find(
    (length) => length.length === selectedHairLength,
  )?.hair_length_id;
  const currentCoatTypeId = coatTypes.find(
    (coat) => coat.coat_type === selectedCoatType,
  )?.coat_type_id;
  const currentSizeTierId = sizeTiers.find(
    (size) => size.size_tier === selectedSizeTier,
  )?.size_tier_id;

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
          <Text className="text-4xl font-hn-bold text-gray-800 pb-1">
            {pet.pet_data?.name || 'Unknown Pet'}
          </Text>
          <CustomDropdown
            options={breedOptions}
            selectedOption={currentBreedId}
            onSelect={(selectedId) => {
              const selectedBreedObj = breeds.find(
                (breed) => breed.breed_id === selectedId,
              );
              setSelectedBreed(selectedBreedObj?.breed || 'Not Assigned');
              const updatedData = {
                pet_id: pet.pet_data.id,
                breed_id: selectedId, // Changed from 'breed' to 'breed_id'
              };
              dispatch(
                setPetDetails({
                  ...pet,
                  pet_data: {
                    ...pet.pet_data,
                    breed: selectedBreedObj?.breed || 'Not Assigned',
                  },
                }),
              );
              dispatch(
                updatePetAction({
                  petData: updatedData,
                  onSuccess: () => {
                    dispatch(fetchPetsAction());
                    dispatch(fetchClientDetailsAction(origPetOwnerId));
                  },
                }),
              );
            }}
            title="Breed"
            placeholder="Select Breed"
          >
            <Text className="text-lg font-hn-regular bg-white px-2 rounded-full">
              {selectedBreed}
            </Text>
          </CustomDropdown>
        </View>

        {/* Basic Info Card */}
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-2xl font-hn-bold mb-2">Basic Information</Text>
          <View className="flex-row items-center gap-1 py-1">
            <Text className="text-lg font-hn-medium">Age:</Text>
            <Text className="text-lg font-hn-regular">
              {pet.pet_data?.age + ' years' || '0 years'}
            </Text>
          </View>
          <View className="flex-row items-center gap-1 py-1">
            <Text className="text-lg font-hn-medium">Gender:</Text>
            <Text className="text-lg font-hn-regular">
              {pet.pet_data?.gender === 1
                ? 'Male'
                : pet.pet_data?.gender === 2
                  ? 'Female'
                  : 'Unknown'}
            </Text>
          </View>
          <View className="flex-row items-center gap-1 py-1">
            <Text className="text-lg font-hn-medium">Weight:</Text>
            <Text className="text-lg font-hn-regular">
              {pet.pet_data?.weight + ' lbs' || '0 lbs'}
            </Text>
          </View>
          <View className="flex-row items-center gap-1 py-1">
            <Text className="text-lg font-hn-medium">Size Tier:</Text>
            <CustomDropdown
              options={sizeTearsOptions}
              selectedOption={currentSizeTierId}
              onSelect={(selectedId) => {
                const selectedSizeTierObj = sizeTiers.find(
                  (size) => size.size_tier_id === selectedId,
                );
                setSelectedSizeTier(
                  selectedSizeTierObj?.size_tier || 'Not Assigned',
                );
                const updatedData = {
                  pet_id: pet.pet_data.id,
                  size_tier_id: selectedId,
                };
                dispatch(
                  updatePetAction({
                    petData: updatedData,
                    onSuccess: () => {
                      dispatch(fetchPetsAction());
                      dispatch(fetchClientDetailsAction(origPetOwnerId));
                    },
                  }),
                );
              }}
              title="Size Tier"
              placeholder="Select Size Tier"
            >
              <Text className="text-lg font-hn-regular bg-[#f0f0f0] px-2 rounded-full">
                {selectedSizeTier}
              </Text>
            </CustomDropdown>
          </View>
        </View>

        {/* Health Info Card */}
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-2xl font-hn-bold mb-2">Health Information</Text>
          <View className="flex-row items-center gap-1 py-1">
            <Text className="text-lg font-hn-medium">Fixed:</Text>
            <CustomDropdown
              options={[
                { label: 'Yes', value: 1 },
                { label: 'No', value: 2 },
              ]}
              selectedOption={fixed}
              onSelect={(value) => {
                setFixed(value === '' ? 'Not Assigned' : value);
                const updatedData = {
                  pet_id: pet.pet_data.id,
                  fixed: value,
                };
                dispatch(
                  updatePetAction({
                    petData: updatedData,
                    onSuccess: () => {
                      dispatch(fetchPetsAction());
                      dispatch(fetchClientDetailsAction(origPetOwnerId));
                    },
                  }),
                );
              }}
              title="Fixed"
              placeholder="Is the pet fixed?"
            >
              <Text className="text-lg font-hn-regular bg-[#f0f0f0] px-2 rounded-full">
                {fixed === 1 ? 'Yes' : fixed === 2 ? 'No' : 'Not Assigned'}
              </Text>
            </CustomDropdown>
          </View>
          {pet.pet_data?.deceased === 1 && (
            <View className="flex-row items-center gap-1 py-1">
              <Text className="text-lg font-hn-medium">Deceased:</Text>
              <CustomDropdown
                options={[
                  { label: 'Yes', value: 1 },
                  { label: 'No', value: 0 },
                ]}
                selectedOption={1}
                onSelect={(value) => {
                  dispatch(
                    updatePetIsDeceasedAction({
                      petId: pet.pet_data.id,
                      isDeceased: value === 1,
                      onSuccess: () => {
                        dispatch(fetchPetsAction());
                        dispatch(fetchClientDetailsAction(origPetOwnerId));
                      },
                    }),
                  );
                }}
                title="Deceased"
                placeholder="Select Status"
                canBeNull={false}
              >
                <Text className="text-lg font-hn-regular bg-[#f0f0f0] px-2 rounded-full">
                  Yes
                </Text>
              </CustomDropdown>
            </View>
          )}
        </View>

        {/* Grooming Info Card */}
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-2xl font-hn-bold mb-2">
            Grooming Information
          </Text>
          <View className="flex-row items-center gap-1 py-1">
            <Text className="text-lg font-hn-medium">Coat Type:</Text>
            <CustomDropdown
              options={coatTypesOptions}
              selectedOption={currentCoatTypeId}
              onSelect={(selectedId) => {
                const selectedCoatTypeObj = coatTypes.find(
                  (coat) => coat.coat_type_id === selectedId,
                );
                setSelectedCoatType(
                  selectedCoatTypeObj?.coat_type || 'Not Assigned',
                );
                const updatedData = {
                  pet_id: pet.pet_data.id,
                  coat_type_id: selectedId,
                };
                dispatch(
                  updatePetAction({
                    petData: updatedData,
                    onSuccess: () => {
                      dispatch(fetchPetsAction());
                      dispatch(fetchClientDetailsAction(origPetOwnerId));
                    },
                  }),
                );
              }}
              title="Coat Type"
              placeholder="Select Coat Type"
            >
              <Text className="text-lg font-hn-regular bg-[#f0f0f0] px-2 rounded-full">
                {selectedCoatType}
              </Text>
            </CustomDropdown>
          </View>
          <View className="flex-row items-center gap-1 py-1">
            <Text className="text-lg font-hn-medium">Hair Length:</Text>
            <CustomDropdown
              options={hairLengthsOptions}
              selectedOption={currentHairLengthId}
              onSelect={(selectedId) => {
                const selectedHairLengthObj = hairLengths.find(
                  (length) => length.hair_length_id === selectedId,
                );
                setSelectedHairLength(
                  selectedHairLengthObj?.length || 'Not Assigned',
                );
                const updatedData = {
                  pet_id: pet.pet_data.id,
                  hair_length_id: selectedId,
                };
                dispatch(
                  updatePetAction({
                    petData: updatedData,
                    onSuccess: () => {
                      dispatch(fetchPetsAction());
                      dispatch(fetchClientDetailsAction(origPetOwnerId));
                    },
                  }),
                );
              }}
              title="Hair Length"
              placeholder="Select Hair Length"
            >
              <Text className="text-lg font-hn-regular bg-[#f0f0f0] px-2 rounded-full">
                {selectedHairLength}
              </Text>
            </CustomDropdown>
          </View>
          <View className="flex-row items-center gap-1 py-1">
            <Text className="text-lg font-hn-medium">Typical Groomer:</Text>
            <CustomDropdown
              options={employees}
              selectedItem={pet.pet_data?.typical_groomer}
              onSelect={(item) => {
                const updatedData = {
                  pet_id: pet.pet_data.id,
                  typical_groomer: item.id,
                };
                dispatch(
                  updatePetAction({
                    petData: updatedData,
                    onSuccess: () => {
                      dispatch(fetchPetsAction());
                      dispatch(fetchClientDetailsAction(origPetOwnerId));
                    },
                  }),
                );
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
          <View className="flex-row items-center gap-1 py-1">
            <Text className="text-lg font-hn-medium">Owner:</Text>
            <CustomDropdown
              options={clientOptions}
              selectedOption={currentClientId}
              onSelect={(selectedId) => {
                const selectedClient = clients.find(
                  (client) => client.client_id === selectedId,
                );
                setSelectedClient(
                  selectedClient
                    ? `${selectedClient.fname} ${selectedClient.lname}`
                    : 'Not Assigned',
                );
                const updatedData = {
                  pet_id: pet.pet_data.id,
                  client_id: selectedId,
                };
                dispatch(
                  updatePetAction({
                    petData: updatedData,
                    onSuccess: () => {
                      dispatch(fetchPetsAction());
                      dispatch(fetchClientDetailsAction(origPetOwnerId));
                    },
                  }),
                );
              }}
              title="Owner"
              placeholder="Select Owner"
              canBeNull={false}
            >
              <Text className="text-lg font-hn-regular bg-[#f0f0f0] px-2 rounded-full">
                {selectedClient}
              </Text>
            </CustomDropdown>
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
