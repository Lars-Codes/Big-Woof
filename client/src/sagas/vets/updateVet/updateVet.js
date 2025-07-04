import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setLoading } from '../../../state/clientDetails/clientDetailsSlice';

export default function* updateVet(action) {
  let vetData, onSuccess, onError;

  // Handle both old format and new format with callbacks
  if (action.payload.onSuccess || action.payload.onError) {
    // New format: extract callbacks and use the rest as vetData
    ({ onSuccess, onError, ...vetData } = action.payload);
  } else {
    // Old format: entire payload is vetData
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

    const res = yield call(api, '/updateVetContact', 'PATCH', formData, {
      'Content-Type': 'multipart/form-data',
    });

    if (res?.success) {
      if (onSuccess && typeof onSuccess === 'function') {
        yield call(onSuccess, res);
      }
    } else {
      console.error('Failed to update vet:', res);
      if (onError && typeof onError === 'function') {
        yield call(onError, res);
      }
    }
    return res;
  } catch (error) {
    console.error('Error updating vet:', error);
    if (onError && typeof onError === 'function') {
      yield call(onError, error);
    }
  } finally {
    yield put(setLoading(false));
  }
}
