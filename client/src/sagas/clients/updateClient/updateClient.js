import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setUpdateClientResult } from '../../../state/clients/clientsSlice';

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
  const { clientData } = action.payload;
  const clientId = clientData.client_id || action.payload.clientId;

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
      results.length > 0 && results.every((res) => res.success);
    const combinedResult = {
      success: allSuccessful ? 1 : 0,
      message: allSuccessful
        ? 'Client updated successfully'
        : 'Failed to update client',
      client_id: clientId,
    };

    yield put(setUpdateClientResult(combinedResult));
  } catch (error) {
    console.error('Error updating client:', error);
    yield put(
      setUpdateClientResult({
        success: 0,
        message: 'Error updating client',
        client_id: clientId,
      }),
    );
  }
}
