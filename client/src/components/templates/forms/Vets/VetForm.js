import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { vetFormConfig } from './vetFormConfig';
import { createVetAction } from '../../../../sagas/vets/createVet/action';
import { updateVetAction } from '../../../../sagas/vets/updateVet/action';
import {
  selectClientDetails,
  selectClientVetDetails,
} from '../../../../state/clientDetails/clientDetailsSlice';
import DynamicForm from '../DynamicForm';

export default function VetForm({ navigation }) {
  const dispatch = useDispatch();
  const clientDetails = useSelector(selectClientDetails);
  const vet = useSelector(selectClientVetDetails);

  const [createResult, setCreateResult] = useState(null);
  const [updateResult, setUpdateResult] = useState(null);

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
        }),
      );
    } else {
      dispatch(createVetAction({ vetData }));
    }
  };

  // Handle create/update results
  useEffect(() => {
    if (createResult?.success) {
      Alert.alert('Success', 'Vet created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [createResult]);

  useEffect(() => {
    if (updateResult?.success) {
      Alert.alert('Success', 'Vet updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [updateResult]);

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
