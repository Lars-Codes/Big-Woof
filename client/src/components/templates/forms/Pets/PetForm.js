import React, { useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import prompt from 'react-native-prompt-android';
import { useDispatch, useSelector } from 'react-redux';
import { PetFormConfig } from './PetFormConfig';
import { fetchClientDetailsAction } from '../../../../sagas/clients/fetchClientDetails/action';
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
  selectLoading,
  selectBreeds,
  selectCoatTypes,
  selectHairLengths,
  selectSizeTiers,
} from '../../../../state/pets/petsSlice';
import DynamicForm from '../DynamicForm';

export default function PetForm({ navigation }) {
  const dispatch = useDispatch();
  const clients = useSelector(selectClients);
  const pet = useSelector(selectPetDetails);
  const loading = useSelector(selectLoading);
  const petBreeds = useSelector(selectBreeds);
  const coatTypes = useSelector(selectCoatTypes);
  const hairLengths = useSelector(selectHairLengths);
  const sizeTiers = useSelector(selectSizeTiers);

  useEffect(() => {
    if (!petBreeds.length) dispatch(fetchBreedsAction());
    if (!coatTypes.length) dispatch(fetchCoatTypesAction());
    if (!hairLengths.length) dispatch(fetchHairLengthsAction());
    if (!sizeTiers.length) dispatch(fetchSizeTiersAction());
  }, [
    dispatch,
    petBreeds.length,
    coatTypes.length,
    hairLengths.length,
    sizeTiers.length,
  ]);

  // Helper functions for adding/deleting dropdown options
  const handleAdd = (title, action) => {
    prompt(
      `Add new ${title}`,
      `Enter the new ${title.toLowerCase()}:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (inputValue) => {
            if (inputValue && inputValue.trim()) {
              const callbacks = {
                onSuccess: () => {
                  Alert.alert(
                    'Success',
                    `${title} "${inputValue.trim()}" created successfully!`,
                  );
                },
                onError: (error) => {
                  Alert.alert(
                    'Error',
                    `Failed to create ${title.toLowerCase()}. Please try again.`,
                  );
                  console.error(`Error creating ${title}:`, error);
                },
              };

              let payload;
              switch (title) {
                case 'Hair Length':
                  payload = {
                    hairLengthData: { hair_length: inputValue.trim() },
                    ...callbacks,
                  };
                  break;
                case 'Breed':
                  payload = {
                    breedData: { breed: inputValue.trim() },
                    ...callbacks,
                  };
                  break;
                case 'Size Tier':
                  payload = {
                    sizeTierData: { size_tier: inputValue.trim() },
                    ...callbacks,
                  };
                  break;
                case 'Coat Type':
                  payload = {
                    coatTypeData: { coat_type: inputValue.trim() },
                    ...callbacks,
                  };
                  break;
                default:
                  console.error('Unknown title:', title);
                  return;
              }

              dispatch(action(payload));
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
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const callbacks = {
              onSuccess: () => {
                Alert.alert(
                  'Success',
                  `${title} "${field}" deleted successfully!`,
                );
              },
              onError: (error) => {
                Alert.alert(
                  'Error',
                  `Failed to delete ${title.toLowerCase()}. Please try again.`,
                );
                console.error(`Error deleting ${title}:`, error);
              },
            };

            let payload;
            switch (title) {
              case 'Hair Length':
                payload = { hair_length_id: value, ...callbacks };
                break;
              case 'Breed':
                payload = { breed_id: value, ...callbacks };
                break;
              case 'Size Tier':
                payload = { size_tier_id: value, ...callbacks };
                break;
              case 'Coat Type':
                payload = { coat_type_id: value, ...callbacks };
                break;
              default:
                console.error('Unknown title:', title);
                return;
            }

            dispatch(action(payload));
          },
        },
      ],
      { cancelable: true },
    );
  };

  // Create dynamic config with populated options
  const dynamicConfig = useMemo(() => {
    const config = { ...PetFormConfig };
    // Populate dropdown options
    config.fields = config.fields.map((field) => {
      switch (field.name) {
        case 'client_id':
          return {
            ...field,
            options: clients.map((client) => ({
              label: `${client.fname} ${client.lname}`,
              value: client.client_id,
            })),
          };

        case 'breed_id':
          return {
            ...field,
            options: petBreeds.map((breed) => ({
              label: breed.breed,
              value: breed.breed_id,
            })),
            handleAdd: () => handleAdd('Breed', createBreedAction),
            handleDelete: (selectedOptionData) =>
              handleDelete(
                'Breed',
                selectedOptionData.label,
                deleteBreedAction,
                selectedOptionData.value,
              ),
          };

        case 'size_tier_id':
          return {
            ...field,
            options: sizeTiers.map((tier) => ({
              label: tier.size_tier,
              value: tier.size_tier_id,
            })),
            handleAdd: () => handleAdd('Size Tier', createSizeTierAction),
            handleDelete: (selectedOptionData) =>
              handleDelete(
                'Size Tier',
                selectedOptionData.label,
                deleteSizeTierAction,
                selectedOptionData.value,
              ),
          };

        case 'hair_length_id':
          return {
            ...field,
            options: hairLengths.map((length) => ({
              label: length.length,
              value: length.hair_length_id,
            })),
            handleAdd: () => handleAdd('Hair Length', createHairLengthAction),
            handleDelete: (selectedOptionData) =>
              handleDelete(
                'Hair Length',
                selectedOptionData.label,
                deleteHairLengthAction,
                selectedOptionData.value,
              ),
          };

        case 'coat_type_id':
          return {
            ...field,
            options: coatTypes.map((coat) => ({
              label: coat.coat_type,
              value: coat.coat_type_id,
            })),
            handleAdd: () => handleAdd('Coat Type', createCoatTypeAction),
            handleDelete: (selectedOptionData) =>
              handleDelete(
                'Coat Type',
                selectedOptionData.label,
                deleteCoatTypeAction,
                selectedOptionData.value,
              ),
          };

        default:
          return field;
      }
    });

    return config;
  }, [pet, clients, petBreeds, sizeTiers, hairLengths, coatTypes]);

  // Prepare initial data for editing OR adding with pre-filled client
  const initialData = useMemo(() => {
    // If editing existing pet
    if (pet?.pet_data) {
      // Find matching option values for dropdowns
      const matchingBreed = petBreeds.find(
        (breed) => breed.breed === pet.pet_data.breed,
      );
      const matchingSizeTier = sizeTiers.find(
        (tier) => tier.size_tier === pet.pet_data.size_tier,
      );
      const matchingHairLength = hairLengths.find(
        (length) => length.length === pet.pet_data.hair_length,
      );
      const matchingCoatType = coatTypes.find(
        (coat) => coat.coat_type === pet.pet_data.coat_type,
      );

      return {
        name: pet.pet_data.name || '',
        client_id: pet.pet_data.owner_id || '',
        gender: pet.pet_data.gender || '',
        age: pet.pet_data.age ? pet.pet_data.age.toString() : '',
        fixed: pet.pet_data.fixed || '',
        breed_id: matchingBreed ? matchingBreed.breed_id : '',
        weight: pet.pet_data.weight ? pet.pet_data.weight.toString() : '',
        size_tier_id: matchingSizeTier ? matchingSizeTier.size_tier_id : '',
        hair_length_id: matchingHairLength
          ? matchingHairLength.hair_length_id
          : '',
        coat_type_id: matchingCoatType ? matchingCoatType.coat_type_id : '',
        notes: pet.pet_data.notes || '',
      };
    }

    // If adding new pet with pre-filled client_id
    if (pet?.client_id) {
      return {
        name: '',
        client_id: pet.client_id, // Pre-fill the client_id
        gender: '',
        age: '',
        fixed: '',
        breed_id: '',
        weight: '',
        size_tier_id: '',
        hair_length_id: '',
        coat_type_id: '',
        notes: '',
      };
    }

    // If completely new pet (no pre-filled data)
    return null;
  }, [pet, petBreeds, sizeTiers, hairLengths, coatTypes]);

  const handleSubmit = (formData) => {
    if (pet?.pet_data) {
      // Update existing pet
      const updatedForm = { ...formData, pet_id: pet.pet_data.id };
      dispatch(
        updatePetAction({
          petData: updatedForm,
          onSuccess: () => {
            Alert.alert('Success', 'Pet updated successfully!', [
              {
                text: 'OK',
                onPress: () => {
                  dispatch(fetchPetsAction());
                  dispatch(fetchPetDetailsAction(pet.pet_data.id));
                  dispatch(fetchPetProfilePictureAction(pet.pet_data.id));
                  dispatch(fetchClientDetailsAction(pet.pet_data.owner_id));
                  navigation.goBack();
                },
              },
            ]);
          },
          onError: (error) => {
            Alert.alert('Error', `Failed to update pet: ${error.message}`);
          },
        }),
      );
    } else {
      // Create new pet
      dispatch(
        createPetAction({
          petData: formData,
          onSuccess: (result) => {
            Alert.alert('Success', 'Pet created successfully!', [
              {
                text: 'OK',
                onPress: () => {
                  dispatch(fetchPetsAction());
                  navigation.goBack();
                },
              },
              {
                text: 'View Pet',
                onPress: () => {
                  dispatch(fetchPetDetailsAction(result.pet_id));
                  dispatch(fetchPetProfilePictureAction(result.pet_id));
                  dispatch(fetchClientDetailsAction(result.client_id));
                  navigation.goBack();
                  navigation.navigate('PetDetails');
                },
              },
            ]);
          },
          onError: (error) => {
            Alert.alert('Error', `Failed to create pet: ${error.message}`);
          },
        }),
      );
    }
  };

  return (
    <DynamicForm
      formConfig={dynamicConfig}
      initialData={initialData}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
