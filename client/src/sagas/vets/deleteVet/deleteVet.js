import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  removeClientVet,
  setLoading,
} from '../../../state/clientDetails/clientDetailsSlice';

export default function* deleteVet(action) {
  let clientId, vetId, onSuccess, onError;

  // Handle both old format and new format with callbacks
  if (action.payload.clientId && action.payload.vetId) {
    ({ clientId, vetId, onSuccess, onError } = action.payload);
  } else {
    // Fallback for old format
    clientId = action.payload.clientId;
    vetId = action.payload.vetId;
    onSuccess = null;
    onError = null;
  }

  try {
    // yield put(setLoading(true));
    const res = yield call(api, '/deleteVet', 'DELETE', {
      client_id: clientId,
      vet_id: vetId,
    });

    if (res?.success) {
      yield put(removeClientVet(vetId));

      if (onSuccess && typeof onSuccess === 'function') {
        yield call(onSuccess, res);
      }
    } else {
      console.error('Failed to delete vet:', res);
      if (onError && typeof onError === 'function') {
        yield call(onError, res);
      }
    }
    return res;
  } catch (error) {
    console.error('Error deleting vet:', error);
    if (onError && typeof onError === 'function') {
      yield call(onError, error);
    }
  } finally {
    yield put(setLoading(false));
  }
}
