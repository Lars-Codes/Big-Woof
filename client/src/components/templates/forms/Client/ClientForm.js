import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createClientAction } from '../../../../sagas/clients/createClient/action';
import { fetchClientDetailsAction } from '../../../../sagas/clients/fetchClientDetails/action';
import { selectClientDetails } from '../../../../state/clientDetails/clientDetailsSlice';
import {
  setCreateClientResult,
  selectCreateClientResult,
  selectUpdateClientResult,
  selectLoading,
  setUpdateClientResult,
} from '../../../../state/clients/clientsSlice';

export default function ClientForm({ onSuccess }) {
  const dispatch = useDispatch();
  const client = useSelector(selectClientDetails);
  const createClientResult = useSelector(selectCreateClientResult);
  const updateClientResult = useSelector(selectUpdateClientResult);
  const loading = useSelector(selectLoading);

  const [form, setForm] = useState({
    fname: '',
    lname: '',
    phone_number: '',
    email: '',
    street_address: '',
    city: '',
    state: '',
    zip: '',
    secondary_phone: '',
    notes: '',
    favorite: 0,
  });

  // If editing, pre-fill form with client data
  useEffect(() => {
    if (client) {
      setForm({
        fname: client.client_data?.fname || '',
        lname: client.client_data?.lname || '',
        phone_number: client.client_contact?.primary_phone || '',
        email: client.client_contact?.email || '',
        street_address: client.client_contact?.street_address || '',
        city: client.client_contact?.city || '',
        state: client.client_contact?.state || '',
        zip: client.client_contact?.zip || '',
        secondary_phone: client.client_contact?.secondary_phone || '',
        notes: client.client_data?.notes || '',
        favorite: client.client_data?.favorite || 0,
      });
    }
  }, [client]);

  useEffect(() => {
    if (createClientResult) {
      if (createClientResult.success) {
        dispatch(fetchClientDetailsAction(createClientResult.client_id));
        Alert.alert(
          'Success',
          'Client created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                dispatch(setCreateClientResult(null));
                // Pass new client data to onSuccess
                onSuccess?.({
                  ...form,
                  client_id: createClientResult.client_id,
                });
                setForm({
                  fname: '',
                  lname: '',
                  phone_number: '',
                  email: '',
                  street_address: '',
                  city: '',
                  state: '',
                  zip: '',
                  secondary_phone: '',
                  notes: '',
                  favorite: 0,
                });
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert(
          'Error',
          createClientResult.message || 'Failed to create client.',
        );
      }
      dispatch(setCreateClientResult(null));
    }
  }, [createClientResult, dispatch, onSuccess, form]);

  useEffect(() => {
    if (updateClientResult) {
      if (updateClientResult.success) {
        Alert.alert(
          'Success',
          'Client updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                dispatch(setUpdateClientResult(null));
                onSuccess?.();
                setForm({
                  fname: '',
                  lname: '',
                  phone_number: '',
                  email: '',
                  street_address: '',
                  city: '',
                  state: '',
                  zip: '',
                  secondary_phone: '',
                  notes: '',
                  favorite: 0,
                });
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert(
          'Error',
          updateClientResult.message || 'Failed to update client.',
        );
      }
      dispatch(setUpdateClientResult(null));
    }
  }, [updateClientResult, dispatch, onSuccess]);

  // Handle input changes
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submit (dispatch create or edit action)
  const handleSubmit = () => {
    if (client && client.client_data) {
      // dispatch(updateClientAction({ clientData: form }));
    } else {
      dispatch(createClientAction({ clientData: form }));
    }
  };

  const isFormValid = () => {
    return (
      form.fname.trim() !== '' &&
      form.lname.trim() !== '' &&
      form.phone_number.trim() !== ''
    );
  };

  return (
    <View className="flex-1 justify-between">
      {/* Form Header */}
      <View className="mb-4">
        <Text className="text-xl font-bold text-center">
          {client && client.client_data ? 'Update Client' : 'Add New Client'}
        </Text>
      </View>

      {/* Form Fields */}
      <View className="gap-4 flex-1">
        <TextInput
          value={form.fname}
          onChangeText={(text) => handleChange('fname', text)}
          placeholder="First Name"
          placeholderTextColor={'#888'}
          className="border border-gray-300 bg-white rounded p-3"
        />

        <TextInput
          value={form.lname}
          onChangeText={(text) => handleChange('lname', text)}
          placeholder="Last Name"
          placeholderTextColor={'#888'}
          className="border border-gray-300 bg-white rounded p-3"
        />

        <TextInput
          value={form.phone_number}
          onChangeText={(text) => handleChange('phone_number', text)}
          placeholder="Phone Number"
          placeholderTextColor={'#888'}
          className="border border-gray-300 bg-white rounded p-3"
          keyboardType="phone-pad"
        />

        <TextInput
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
          placeholder="Email (optional)"
          placeholderTextColor={'#888'}
          className="border border-gray-300 bg-white rounded p-3"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-blue-500 rounded-lg p-4 items-center mt-4"
        disabled={!isFormValid() || loading}
        style={{
          opacity: isFormValid() && !loading ? 1 : 0.5,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
          {loading
            ? 'Saving...'
            : client && client.client_data
              ? 'Update Client'
              : 'Create Client'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
