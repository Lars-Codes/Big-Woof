import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setLoading } from '../../../state/clientDetails/clientDetailsSlice';

export default function* createVet(action) {
  let vetData, onSuccess, onError;

  // Handle both old format (just vetData) and new format (object with callbacks)
  if (action.payload.vetData) {
    ({ vetData, onSuccess, onError } = action.payload);
  } else {
    vetData = action.payload;
    onSuccess = null;
    onError = null;
  }

  try {
    // yield put(setLoading(true));
    const formData = new FormData();
    Object.entries(vetData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    const res = yield call(api, '/createVet', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });

    if (res?.success) {
      if (onSuccess && typeof onSuccess === 'function') {
        yield call(onSuccess, res);
      }
    } else {
      console.error('Failed to create vet:', res);
      if (onError && typeof onError === 'function') {
        yield call(onError, res);
      }
    }
    return res;
  } catch (error) {
    console.error('Error creating vet:', error);
    if (onError && typeof onError === 'function') {
      yield call(onError, error);
    }
  } finally {
    yield put(setLoading(false));
  }
}
