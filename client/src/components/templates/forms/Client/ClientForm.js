import React, { useMemo } from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ClientFormConfig } from './ClientFormConfig';
import { createClientAction } from '../../../../sagas/clients/createClient/action';
import { fetchClientAppointmentsAction } from '../../../../sagas/clients/fetchClientAppointments/action';
import { fetchClientDetailsAction } from '../../../../sagas/clients/fetchClientDetails/action';
import { fetchClientDocumentsAction } from '../../../../sagas/clients/fetchClientDocuments/action';
import { fetchClientProfilePictureAction } from '../../../../sagas/clients/fetchClientProfilePicture/action';
import { fetchClientsAction } from '../../../../sagas/clients/fetchClients/action';
import { fetchClientStatsAction } from '../../../../sagas/clients/fetchClientStats/action';
import { updateClientAction } from '../../../../sagas/clients/updateClient/action';
import { selectClientDetails } from '../../../../state/clientDetails/clientDetailsSlice';
import { selectLoading } from '../../../../state/clients/clientsSlice';
import DynamicForm from '../DynamicForm';

export default function ClientForm({ navigation }) {
  const dispatch = useDispatch();
  const client = useSelector(selectClientDetails);
  const loading = useSelector(selectLoading);

  // Create dynamic config with populated options
  const dynamicConfig = useMemo(() => {
    const config = { ...ClientFormConfig };

    // Update form title based on edit mode
    config.submitButtonText = client?.client_data
      ? 'Update Client'
      : 'Create Client';

    return config;
  }, [client]);

  // Prepare initial data for editing
  const initialData = useMemo(() => {
    if (!client?.client_data) return null;

    return {
      fname: client.client_data?.fname || '',
      lname: client.client_data?.lname || '',
      phone_number: client.client_contact?.primary_phone || '',
      email: client.client_contact?.email || '',
      street_address: client.client_contact?.street_address || '',
      city: client.client_contact?.city || '',
      state: client.client_contact?.state || '',
      zip: client.client_contact?.zip || '',
      secondary_phone: client.client_contact?.secondary_phone || '',
    };
  }, [client]);

  const handleSubmit = (formData) => {
    if (client?.client_data) {
      // Update existing client
      const updatedForm = {
        ...formData,
        client_id: client.client_data.client_id,
      };
      dispatch(
        updateClientAction({
          clientData: updatedForm,
          onSuccess: () => {
            // Refresh all client data
            dispatch(fetchClientsAction());
            dispatch(fetchClientDetailsAction(client.client_data.client_id));
            dispatch(fetchClientStatsAction(client.client_data.client_id));
            dispatch(fetchClientDocumentsAction(client.client_data.client_id));
            dispatch(
              fetchClientAppointmentsAction(client.client_data.client_id),
            );
            dispatch(
              fetchClientProfilePictureAction(client.client_data.client_id),
            );
            Alert.alert('Success', 'Client updated successfully!', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]);
          },
          onError: (error) => {
            Alert.alert(
              'Error',
              `Failed to update client: ${error.message || 'Please try again.'}`,
            );
          },
        }),
      );
    } else {
      // Create new client
      dispatch(
        createClientAction({
          clientData: formData,
          onSuccess: (result) => {
            dispatch(fetchClientsAction());
            Alert.alert('Success', 'Client created successfully!', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
              {
                text: 'View Client',
                onPress: () => {
                  // Fetch all client data for the new client
                  dispatch(fetchClientDetailsAction(result.client_id));
                  dispatch(fetchClientStatsAction(result.client_id));
                  dispatch(fetchClientDocumentsAction(result.client_id));
                  dispatch(fetchClientAppointmentsAction(result.client_id));
                  dispatch(fetchClientProfilePictureAction(result.client_id));
                  navigation.goBack();
                  navigation.navigate('ClientDetails');
                },
              },
            ]);
          },
          onError: (error) => {
            Alert.alert(
              'Error',
              `Failed to create client: ${error.message || 'Please try again.'}`,
            );
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
