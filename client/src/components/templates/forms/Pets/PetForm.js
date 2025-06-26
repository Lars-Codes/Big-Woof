import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import prompt from 'react-native-prompt-android';
import { useDispatch, useSelector } from 'react-redux';
import { createPetAction } from '../../../../sagas/pets/createPet/action';
import { fetchPetDetailsAction } from '../../../../sagas/pets/fetchPetDetails/action';
import { fetchPetProfilePictureAction } from '../../../../sagas/pets/fetchPetProfilePicture/action';
import { fetchPetsAction } from '../../../../sagas/pets/fetchPets/action';
import { updatePetAction } from '../../../../sagas/pets/updatePet/action';
import { createBreedAction } from '../../../../sagas/prefilledData/petAttributes/createBreed/action';
import { createCoatTypeAction } from '../../../../sagas/prefilledData/petAttributes/createCoatType/action';
import { createHairLengthAction } from '../../../../sagas/prefilledData/petAttributes/createHairLength/action';
import { createSizeTierAction } from '../../../../sagas/prefilledData/petAttributes/createSizeTier/action';
import { deleteBreedAction } from '../../../../sagas/prefilledData/petAttributes/deleteBreed/action';
import { deleteCoatTypeAction } from '../../../../sagas/prefilledData/petAttributes/deleteCoatType/action';
import { deleteHairLengthAction } from '../../../../sagas/prefilledData/petAttributes/deleteHairLength/action';
import { deleteSizeTierAction } from '../../../../sagas/prefilledData/petAttributes/deleteSizeTier/action';
import { fetchBreedsAction } from '../../../../sagas/prefilledData/petAttributes/fetchBreeds/action';
import { fetchCoatTypesAction } from '../../../../sagas/prefilledData/petAttributes/fetchCoatTypes/action';
import { fetchHairLengthsAction } from '../../../../sagas/prefilledData/petAttributes/fetchHairLengths/action';
import { fetchSizeTiersAction } from '../../../../sagas/prefilledData/petAttributes/fetchSizeTiers/action';
import { selectClients } from '../../../../state/clients/clientsSlice';
import { selectPetDetails } from '../../../../state/petDetails/petDetailsSlice';
import {
  setCreatePetResult,
  selectCreatePetResult,
  setUpdatePetResult,
  selectUpdatePetResult,
  selectLoading,
  selectBreeds,
  selectCoatTypes,
  selectHairLengths,
  selectSizeTiers,
  selectCreateHairLengthResult,
  selectCreateBreedResult,
  selectCreateCoatTypeResult,
  selectCreateSizeTierResult,
} from '../../../../state/pets/petsSlice';
import CustomTextInput from '../../../atoms/CustomTextInput/CustomTextInput';
import FormDropdown from '../../../molecules/Form/FormDropdown/FormDropdown';

export default function PetForm({ navigation }) {
  const dispatch = useDispatch();

  const clients = useSelector(selectClients);
  const clientOptions = clients.map((client) => ({
    label: client.fname + ' ' + client.lname,
    value: client.client_id,
  }));
  const petBreeds = useSelector(selectBreeds);
  const petBreedsOptions = petBreeds.map((breed) => ({
    label: breed.breed,
    value: breed.breed_id,
  }));
  const coatTypes = useSelector(selectCoatTypes);
  const coatTypesOptions = coatTypes.map((coat) => ({
    label: coat.coat_type,
    value: coat.coat_type_id,
  }));
  const hairLengths = useSelector(selectHairLengths);
  const hairLengthsOptions = hairLengths.map((length) => ({
    label: length.length,
    value: length.hair_length_id,
  }));
  const sizeTiers = useSelector(selectSizeTiers);
  const sizeTiersOptions = sizeTiers.map((tier) => ({
    label: tier.size_tier,
    value: tier.size_tier_id,
  }));
  const genderOptions = [
    { label: 'Male', value: 1 },
    { label: 'Female', value: 2 },
    { label: 'Other', value: 3 },
  ];
  const fixedOptions = [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 2 },
  ];

  const pet = useSelector(selectPetDetails);
  const createPetResult = useSelector(selectCreatePetResult);
  const updatePetResult = useSelector(selectUpdatePetResult);
  const loading = useSelector(selectLoading);

  const createBreedResult = useSelector(selectCreateBreedResult);
  const createCoatTypeResult = useSelector(selectCreateCoatTypeResult);
  const createSizeTierResult = useSelector(selectCreateSizeTierResult);
  const createHairLengthResult = useSelector(selectCreateHairLengthResult);

  const nameRef = useRef(null);
  const clientRef = useRef(null);
  const genderRef = useRef(null);
  const ageRef = useRef(null);
  const fixedRef = useRef(null);
  const breedIdRef = useRef(null);
  const weightRef = useRef(null);
  const sizeTierIdRef = useRef(null);
  const hairLengthRef = useRef(null);
  const coatTypeIdRef = useRef(null);
  const notesRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    client_id: '',
    gender: '',
    age: '',
    fixed: '',
    breed_id: '',
    weight: '',
    size_tier_id: '',
    hair_length_id: '',
    coat_type_id: '',
    notes: '',
  });

  const [errors, setErrors] = useState({
    name: false,
    client_id: false,
  });

  const [errorMessages, setErrorMessages] = useState({
    name: '',
    client_id: '',
  });

  useEffect(() => {
    if (pet?.pet_data && petBreedsOptions.length > 0) {
      const matchingBreed = petBreedsOptions.find(
        (breedOption) => breedOption.label === pet.pet_data.breed,
      );
      const matchingSizeTier = sizeTiersOptions.find(
        (tierOption) => tierOption.label === pet.pet_data.size_tier,
      );
      const matchingHairLength = hairLengthsOptions.find(
        (lengthOption) => lengthOption.label === pet.pet_data.hair_length,
      );
      const matchingCoatType = coatTypesOptions.find(
        (coatOption) => coatOption.label === pet.pet_data.coat_type,
      );

      setForm({
        name: pet?.pet_data.name || '',
        client_id: pet?.pet_data.owner_id || '',
        gender: pet?.pet_data.gender || '',
        age: pet?.pet_data.age ? pet.pet_data.age.toString() : '',
        fixed: pet?.pet_data.fixed || '',
        breed_id: matchingBreed ? matchingBreed.value : '',
        weight: pet?.pet_data.weight ? pet.pet_data.weight.toString() : '',
        size_tier_id: matchingSizeTier ? matchingSizeTier.value : '',
        hair_length_id: matchingHairLength ? matchingHairLength.value : '',
        coat_type_id: matchingCoatType ? matchingCoatType.value : '',
        notes: pet?.pet_data.notes || pet?.pet_data.notes.toString() || '',
      });
    }
  }, [pet]);

  useEffect(() => {
    if (createPetResult) {
      if (createPetResult.success) {
        dispatch(fetchPetsAction());
        Alert.alert(
          'Success',
          'Pet created successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
                dispatch(setCreatePetResult(null));
                setForm({
                  name: '',
                  client_id: '',
                  gender: '',
                  age: '',
                  fixed: '',
                  breed_id: '',
                  weight: '',
                  size_tier_id: '',
                  hair_length_id: '',
                  coat_type_id: '',
                  notes: '',
                });
              },
            },
            {
              text: 'View Pet',
              onPress: () => {
                dispatch(fetchPetDetailsAction(createPetResult.pet_id));
                dispatch(fetchPetProfilePictureAction(createPetResult.pet_id));
                navigation.goBack();
                navigation.navigate('PetDetails');
                setForm({
                  name: '',
                  client_id: '',
                  gender: '',
                  age: '',
                  fixed: '',
                  breed_id: '',
                  weight: '',
                  size_tier_id: '',
                  hair_length_id: '',
                  coat_type_id: '',
                  notes: '',
                });
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert(
          'Error',
          createPetResult.message || 'Failed to create pet.',
        );
      }
      dispatch(setCreatePetResult(null));
    }
  }, [createPetResult, dispatch, form]);

  useEffect(() => {
    if (updatePetResult) {
      if (updatePetResult.success) {
        dispatch(fetchPetsAction());
        dispatch(fetchPetDetailsAction(updatePetResult.pet_id));
        dispatch(fetchPetProfilePictureAction(updatePetResult.pet_id));
        Alert.alert(
          'Success',
          'Pet updated successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
                dispatch(setUpdatePetResult(null));
                setForm({
                  name: '',
                  client_id: '',
                  gender: '',
                  age: '',
                  fixed: '',
                  breed_id: '',
                  weight: '',
                  size_tier_id: '',
                  hair_length_id: '',
                  coat_type_id: '',
                  notes: '',
                });
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert(
          'Error',
          updatePetResult.message || 'Failed to update pet.',
        );
      }
      dispatch(setUpdatePetResult(null));
    }
  }, [updatePetResult, dispatch]);

  useEffect(() => {
    if (createBreedResult) {
      if (createBreedResult.success) {
        dispatch(fetchBreedsAction());
        Alert.alert(
          'Success',
          'Breed created successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                () => {};
              },
            },
          ],
          { cancelable: false },
        );
      }
    }
    dispatch(setCreatePetResult(null));
  }, [createBreedResult, dispatch]);

  useEffect(() => {
    if (createCoatTypeResult) {
      if (createCoatTypeResult.success) {
        dispatch(fetchCoatTypesAction());
        Alert.alert(
          'Success',
          'Coat type created successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                () => {};
              },
            },
          ],
          { cancelable: false },
        );
      }
    }
    dispatch(setCreatePetResult(null));
  }, [createCoatTypeResult, dispatch]);

  useEffect(() => {
    if (createSizeTierResult) {
      if (createSizeTierResult.success) {
        dispatch(fetchSizeTiersAction());
        Alert.alert(
          'Success',
          'Size tier created successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                () => {};
              },
            },
          ],
          { cancelable: false },
        );
      }
    }
    dispatch(setCreatePetResult(null));
  }, [createSizeTierResult, dispatch]);

  useEffect(() => {
    if (createHairLengthResult) {
      if (createHairLengthResult.success) {
        dispatch(fetchHairLengthsAction());
        Alert.alert(
          'Success',
          'Hair length created successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                () => {};
              },
            },
          ],
          { cancelable: false },
        );
      }
    }
    dispatch(setCreatePetResult(null));
  }, [createHairLengthResult, dispatch]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
      setErrorMessages((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAdd = (title, action) => {
    prompt(
      `Add new ${title}`,
      `Enter the new ${title.toLowerCase()}:`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Add',
          onPress: (inputValue) => {
            if (inputValue && inputValue.trim()) {
              let formattedData;
              switch (title) {
                case 'Hair Length':
                  formattedData = { hair_length: inputValue.trim() };
                  dispatch(action({ hairLengthData: formattedData }));
                  break;
                case 'Breed':
                  formattedData = { breed: inputValue.trim() };
                  dispatch(action({ breedData: formattedData }));
                  break;
                case 'Size Tier':
                  formattedData = { size_tier: inputValue.trim() };
                  dispatch(action({ sizeTierData: formattedData }));
                  break;
                case 'Coat Type':
                  formattedData = { coat_type: inputValue.trim() };
                  dispatch(action({ coatTypeData: formattedData }));
                  break;
                default:
                  console.error('Unknown title:', title);
                  return;
              }
            } else {
              Alert.alert('Error', 'Please enter a valid value.');
            }
          },
        },
      ],
      {
        type: 'plain-text',
        cancelable: true,
        defaultValue: '',
        placeholder: `Enter ${title.toLowerCase()}...`,
      },
    );
  };

  const handleDelete = (title, field, action, value) => {
    Alert.alert(
      `Delete ${title}`,
      `Are you sure you want to delete "${field}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(action(value));
          },
        },
      ],
      { cancelable: true },
    );
  };

  const validateForm = () => {
    const newErrors = {};
    const newErrorMessages = {};
    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = true;
      newErrorMessages.name = 'Name is required.';
      isValid = false;
    }

    if (!form.client_id) {
      newErrors.client_id = true;
      newErrorMessages.client_id = 'Client is required.';
      isValid = false;
    }

    setErrors(newErrors);
    setErrorMessages(newErrorMessages);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (pet && pet.pet_data) {
      const updatedForm = { ...form, pet_id: pet.pet_data.id };
      dispatch(updatePetAction({ petData: updatedForm }));
    } else {
      dispatch(createPetAction({ petData: form }));
    }
  };

  const isFormValid = () => {
    return form.name.trim() !== '' && form.client_id !== '';
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1 px-4 mt-20"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={true}
        >
          <CustomTextInput
            ref={nameRef}
            value={form.name}
            onChangeText={(text) => handleChange('name', text)}
            label="Name"
            placeholder="Enter pet's name"
            required
            error={errors.name}
            errorMessage={errorMessages.name}
            returnKeyType="next"
            onSubmitEditing={() => clientRef.current?.focus()}
          />

          <FormDropdown
            ref={clientRef}
            label="Owner"
            options={clientOptions}
            selectedOption={form.client_id}
            onSelect={(value) => handleChange('client_id', value)}
            onAfterSelect={() => genderRef.current?.focus()}
            placeholder="Select Owner"
            required
            error={errors.client_id}
            errorMessage={errorMessages.client_id}
          />

          <FormDropdown
            ref={genderRef}
            label="Gender"
            options={genderOptions}
            selectedOption={form.gender}
            onSelect={(value) => handleChange('gender', value)}
            onAfterSelect={() => ageRef.current?.focus()}
            placeholder="Select Gender"
          />

          <CustomTextInput
            ref={ageRef}
            value={form.age}
            onChangeText={(text) => handleChange('age', text)}
            label="Age (Years)"
            placeholder="Enter pet's age (in years)"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => fixedRef.current?.focus()}
          />

          <FormDropdown
            ref={fixedRef}
            label="Fixed"
            options={fixedOptions}
            selectedOption={form.fixed}
            onSelect={(value) => handleChange('fixed', value)}
            onAfterSelect={() => breedIdRef.current?.focus()}
            placeholder="Is the pet fixed?"
          />

          <FormDropdown
            ref={breedIdRef}
            label="Breed"
            options={petBreedsOptions}
            selectedOption={form.breed_id}
            onSelect={(value) => handleChange('breed_id', value)}
            onAfterSelect={() => weightRef.current?.focus()}
            placeholder="Select Breed"
            showEditButton
            handleAdd={() => {
              handleAdd('Breed', createBreedAction);
            }}
            handleDelete={(selectedOptionData) => {
              handleDelete(
                'Breed',
                selectedOptionData.label,
                deleteBreedAction,
                selectedOptionData.value,
              );
            }}
          />

          <CustomTextInput
            ref={weightRef}
            value={form.weight}
            onChangeText={(text) => handleChange('weight', text)}
            label="Weight (lbs)"
            placeholder="Enter pet's weight (in lbs)"
            keyboardType="numeric"
            returnKeyType="next"
            onSubmitEditing={() => sizeTierIdRef.current?.focus()}
          />

          <FormDropdown
            ref={sizeTierIdRef}
            label="Size Tier"
            options={sizeTiersOptions}
            selectedOption={form.size_tier_id}
            onSelect={(value) => handleChange('size_tier_id', value)}
            onAfterSelect={() => hairLengthRef.current?.focus()}
            placeholder="Select Size Tier"
            showEditButton
            handleAdd={() => {
              handleAdd('Size Tier', createSizeTierAction);
            }}
            handleDelete={(selectedOptionData) => {
              handleDelete(
                'Size Tier',
                selectedOptionData.label,
                deleteSizeTierAction,
                selectedOptionData.value,
              );
            }}
          />

          <FormDropdown
            ref={hairLengthRef}
            label="Hair Length"
            options={hairLengthsOptions}
            selectedOption={form.hair_length_id}
            onSelect={(value) => handleChange('hair_length_id', value)}
            onAfterSelect={() => coatTypeIdRef.current?.focus()}
            placeholder="Select Hair Length"
            showEditButton
            handleAdd={() => {
              handleAdd('Hair Length', createHairLengthAction);
            }}
            handleDelete={(selectedOptionData) => {
              handleDelete(
                'Hair Length',
                selectedOptionData.label,
                deleteHairLengthAction,
                selectedOptionData.value,
              );
            }}
          />

          <FormDropdown
            ref={coatTypeIdRef}
            label="Coat Type"
            options={coatTypesOptions}
            selectedOption={form.coat_type_id}
            onSelect={(value) => handleChange('coat_type_id', value)}
            onAfterSelect={() => notesRef.current?.focus()}
            placeholder="Select Coat Type"
            showEditButton
            handleAdd={() => {
              handleAdd('Coat Type', createCoatTypeAction);
            }}
            handleDelete={(selectedOptionData) => {
              handleDelete(
                'Coat Type',
                selectedOptionData.label,
                deleteCoatTypeAction,
                selectedOptionData.value,
              );
            }}
          />

          <CustomTextInput
            ref={notesRef}
            value={form.notes}
            onChangeText={(text) => handleChange('notes', text)}
            label="Notes"
            placeholder="Enter any notes about the pet"
          />
        </ScrollView>

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-blue-500 p-4 items-center"
          disabled={!isFormValid() || loading}
          style={{
            opacity: isFormValid() && !loading ? 1 : 0.5,
          }}
        >
          <Text className="font-hn-bold text-white text-2xl mb-4">
            {pet ? 'Update Pet' : 'Create Pet'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
