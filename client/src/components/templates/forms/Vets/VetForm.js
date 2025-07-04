import React from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { vetFormConfig } from './vetFormConfig';
import { fetchClientDetailsAction } from '../../../../sagas/clients/fetchClientDetails/action';
import { createVetAction } from '../../../../sagas/vets/createVet/action';
import { updateVetAction } from '../../../../sagas/vets/updateVet/action';
import {
  selectClientDetails,
  selectClientVetDetails,
  setClientVetDetails,
} from '../../../../state/clientDetails/clientDetailsSlice';
import DynamicForm from '../DynamicForm';

export default function VetForm({ navigation }) {
  const dispatch = useDispatch();
  const clientDetails = useSelector(selectClientDetails);
  const vet = useSelector(selectClientVetDetails);

  const handleSubmit = (formData) => {
    const vetData = {
      ...formData,
      client_id: clientDetails.client_data.client_id,
    };

    if (vet) {
      dispatch(
        updateVetAction({
          ...vetData,
          vet_id: vet.id,
          onSuccess: () => {
            Alert.alert('Success', 'Vet updated successfully!', [
              {
                text: 'OK',
                onPress: () => {
                  dispatch(setClientVetDetails(null));
                  navigation.goBack();
                },
              },
            ]);
            dispatch(
              fetchClientDetailsAction(clientDetails.client_data.client_id),
            );
          },
          onError: (error) => {
            Alert.alert('Error', `Failed to update vet: ${error.message}`);
            dispatch(setClientVetDetails(null));
          },
        }),
      );
    } else {
      dispatch(
        createVetAction({
          vetData: vetData,
          onSuccess: () => {
            Alert.alert('Success', 'Vet created successfully!', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
            dispatch(
              fetchClientDetailsAction(clientDetails.client_data.client_id),
            );
          },
          onError: (error) => {
            Alert.alert('Error', `Failed to create vet: ${error.message}`);
          },
        }),
      );
    }
  };

  // Modify config for edit mode
  const config = {
    ...vetFormConfig,
    submitButtonText: vet ? 'Update Vet' : 'Create Vet',
  };

  return (
    <DynamicForm
      formConfig={config}
      initialData={vet}
      onSubmit={handleSubmit}
    />
  );
}
