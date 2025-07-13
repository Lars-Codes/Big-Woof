import { call } from 'redux-saga/effects';
import { api } from '../../../services/api';

export function* updateClientBasicData(action) {
  const { clientId, basicData } = action.payload;
  try {
    const formData = new FormData();
    formData.append('client_id', clientId);

    // Only append fields that exist in basicData
    ['fname', 'lname', 'notes'].forEach((field) => {
      if (basicData[field] !== undefined && basicData[field] !== null) {
        formData.append(field, basicData[field].toString());
      }
    });

    const res = yield call(api, '/editClientBasicData', 'PATCH', formData, {
      'Content-Type': 'multipart/form-data',
    });

    return res;
  } catch (error) {
    console.error('Error updating client basic data:', error);
    throw error;
  }
}

export function* updateClientContactData(action) {
  const { clientId, contactData } = action.payload;
  try {
    const formData = new FormData();
    formData.append('client_id', clientId);

    // Map form fields to API fields and append if they exist
    const fieldMapping = {
      phone_number: 'primary_phone',
      secondary_phone: 'secondary_phone',
      email: 'email',
      street_address: 'street_address',
      city: 'city',
      state: 'state',
      zip: 'zip',
    };

    Object.entries(fieldMapping).forEach(([formField, apiField]) => {
      if (
        contactData[formField] !== undefined &&
        contactData[formField] !== null
      ) {
        formData.append(apiField, contactData[formField].toString());
      }
    });

    const res = yield call(api, '/editClientContact', 'PATCH', formData, {
      'Content-Type': 'multipart/form-data',
    });

    return res;
  } catch (error) {
    console.error('Error updating client contact data:', error);
    throw error;
  }
}

export default function* updateClient(action) {
  const { clientData, onSuccess, onError } = action.payload;
  const clientId = clientData.client_id;

  try {
    const results = [];

    // Separate basic and contact data
    const basicData = {
      fname: clientData.fname,
      lname: clientData.lname,
      notes: clientData.notes,
    };

    const contactData = {
      phone_number: clientData.phone_number,
      secondary_phone: clientData.secondary_phone,
      email: clientData.email,
      street_address: clientData.street_address,
      city: clientData.city,
      state: clientData.state,
      zip: clientData.zip,
    };

    // Check if we have basic data to update
    const hasBasicData = Object.values(basicData).some(
      (val) => val !== undefined && val !== null && val !== '',
    );
    if (hasBasicData) {
      const basicResult = yield call(updateClientBasicData, {
        payload: { clientId, basicData },
      });
      results.push(basicResult);
    }

    // Check if we have contact data to update
    const hasContactData = Object.values(contactData).some(
      (val) => val !== undefined && val !== null && val !== '',
    );
    if (hasContactData) {
      const contactResult = yield call(updateClientContactData, {
        payload: { clientId, contactData },
      });
      results.push(contactResult);
    }

    // Simplified result logic
    const allSuccessful =
      results.length > 0 && results.every((res) => res?.success);
    const combinedResult = {
      success: allSuccessful ? 1 : 0,
      message: allSuccessful
        ? 'Client updated successfully'
        : 'Failed to update client',
      client_id: clientId,
    };

    if (
      combinedResult.success &&
      onSuccess &&
      typeof onSuccess === 'function'
    ) {
      yield call(onSuccess, combinedResult);
    } else if (
      !combinedResult.success &&
      onError &&
      typeof onError === 'function'
    ) {
      yield call(onError, combinedResult);
    }

    return combinedResult;
  } catch (error) {
    console.error('Error updating client:', error);

    if (onError && typeof onError === 'function') {
      yield call(onError, error);
    }
  }
}
