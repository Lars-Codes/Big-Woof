import { call } from 'redux-saga/effects';
import { api } from '../../../services/api';

export default function* createClient(action) {
  const { clientData, onSuccess, onError } = action.payload;

  try {
    const formData = new FormData();
    Object.entries(clientData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const res = yield call(api, '/createClient', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });

    if (res?.success && onSuccess && typeof onSuccess === 'function') {
      yield call(onSuccess, res);
    } else if (!res?.success && onError && typeof onError === 'function') {
      yield call(onError, res);
    }

    return res;
  } catch (error) {
    console.error('Error creating client:', error);
    if (onError && typeof onError === 'function') {
      yield call(onError, error);
    }
  }
}
