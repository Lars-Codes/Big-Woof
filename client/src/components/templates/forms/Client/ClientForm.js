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
import { useDispatch, useSelector } from 'react-redux';
import { createClientAction } from '../../../../sagas/clients/createClient/action';
import { fetchClientAppointmentsAction } from '../../../../sagas/clients/fetchClientAppointments/action';
import { fetchClientDetailsAction } from '../../../../sagas/clients/fetchClientDetails/action';
import { fetchClientDocumentsAction } from '../../../../sagas/clients/fetchClientDocuments/action';
import { fetchClientProfilePictureAction } from '../../../../sagas/clients/fetchClientProfilePicture/action';
import { fetchClientsAction } from '../../../../sagas/clients/fetchClients/action';
import { fetchClientStatsAction } from '../../../../sagas/clients/fetchClientStats/action';
import { updateClientAction } from '../../../../sagas/clients/updateClient/action';
import { selectClientDetails } from '../../../../state/clientDetails/clientDetailsSlice';
import {
  setCreateClientResult,
  selectCreateClientResult,
  selectUpdateClientResult,
  selectLoading,
  setUpdateClientResult,
} from '../../../../state/clients/clientsSlice';
import CustomTextInput from '../../../atoms/CustomTextInput/CustomTextInput';

export default function ClientForm({ navigation }) {
  const dispatch = useDispatch();
  const client = useSelector(selectClientDetails);
  const createClientResult = useSelector(selectCreateClientResult);
  const updateClientResult = useSelector(selectUpdateClientResult);
  const loading = useSelector(selectLoading);

  const fnameRef = useRef(null);
  const lnameRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const streetRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const zipRef = useRef(null);
  const secondaryPhoneRef = useRef(null);

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
      });
    }
  }, [client]);

  useEffect(() => {
    if (createClientResult) {
      if (createClientResult.success) {
        dispatch(fetchClientsAction());
        Alert.alert(
          'Success',
          'Client created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
                dispatch(setCreateClientResult(null));
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
                });
              },
            },
            {
              text: 'View Client',
              onPress: () => {
                dispatch(
                  fetchClientDetailsAction(createClientResult.client_id),
                );
                dispatch(fetchClientStatsAction(createClientResult.client_id));
                dispatch(
                  fetchClientDocumentsAction(createClientResult.client_id),
                );
                dispatch(
                  fetchClientAppointmentsAction(createClientResult.client_id),
                );
                dispatch(
                  fetchClientProfilePictureAction(createClientResult.client_id),
                );
                navigation.goBack();
                navigation.navigate('ClientDetails');
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
  }, [createClientResult, dispatch, form]);

  useEffect(() => {
    if (updateClientResult) {
      if (updateClientResult.success) {
        dispatch(fetchClientsAction());
        dispatch(fetchClientDetailsAction(updateClientResult.client_id));
        dispatch(fetchClientStatsAction(updateClientResult.client_id));
        dispatch(fetchClientDocumentsAction(updateClientResult.client_id));
        dispatch(fetchClientAppointmentsAction(updateClientResult.client_id));
        dispatch(fetchClientProfilePictureAction(updateClientResult.client_id));
        Alert.alert(
          'Success',
          'Client updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
                dispatch(setUpdateClientResult(null));
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
  }, [updateClientResult, dispatch]);

  // Handle input changes
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (client && client.client_data) {
      // append the client_id to the form data
      const updatedForm = { ...form, client_id: client.client_data.client_id };
      dispatch(updateClientAction({ clientData: updatedForm }));
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
            ref={fnameRef}
            value={form.fname}
            onChangeText={(text) => handleChange('fname', text)}
            label="First Name"
            placeholder="Enter first name"
            required
            returnKeyType="next"
            onSubmitEditing={() => lnameRef.current?.focus()}
          />

          <CustomTextInput
            ref={lnameRef}
            value={form.lname}
            onChangeText={(text) => handleChange('lname', text)}
            label="Last Name"
            placeholder="Enter last name"
            required
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
          />

          <CustomTextInput
            ref={phoneRef}
            value={form.phone_number}
            onChangeText={(text) => handleChange('phone_number', text)}
            label="Phone Number"
            placeholder="(555) 123-4567"
            required
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />

          <CustomTextInput
            ref={emailRef}
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
            label="Email Address"
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => streetRef.current?.focus()}
          />

          <CustomTextInput
            ref={streetRef}
            value={form.street_address}
            onChangeText={(text) => handleChange('street_address', text)}
            label="Street Address"
            placeholder="123 Main Street"
            returnKeyType="next"
            onSubmitEditing={() => cityRef.current?.focus()}
          />

          <CustomTextInput
            ref={cityRef}
            value={form.city}
            onChangeText={(text) => handleChange('city', text)}
            label="City"
            placeholder="Enter city"
            returnKeyType="next"
            onSubmitEditing={() => stateRef.current?.focus()}
          />

          <CustomTextInput
            ref={stateRef}
            value={form.state}
            onChangeText={(text) => handleChange('state', text)}
            label="State"
            placeholder="Enter state"
            returnKeyType="next"
            onSubmitEditing={() => zipRef.current?.focus()}
          />

          <CustomTextInput
            ref={zipRef}
            value={form.zip}
            onChangeText={(text) => handleChange('zip', text)}
            label="ZIP Code"
            placeholder="12345"
            returnKeyType="next"
            onSubmitEditing={() => secondaryPhoneRef.current?.focus()}
          />

          <CustomTextInput
            ref={secondaryPhoneRef}
            value={form.secondary_phone}
            onChangeText={(text) => handleChange('secondary_phone', text)}
            label="Secondary Phone"
            placeholder="(555) 987-6543"
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
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
            {client && client.client_data ? 'Update Client' : 'Create Client'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
