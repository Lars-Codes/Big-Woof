import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  removeClientVet,
  setLoading,
} from '../../../state/clientDetails/clientDetailsSlice';

export default function* deleteVet(action) {
  const { clientId, vetId } = action.payload;
  try {
    // yield put(setLoading(true));
    const res = yield call(api, '/deleteVet', 'DELETE', {
      client_id: clientId,
      vet_id: vetId,
    });
    if (res?.success) {
      yield put(removeClientVet(vetId));
    } else {
      console.error('Failed to delete vet:', res);
    }
    return res;
  } catch (error) {
    console.error('Error deleting vet:', error);
  } finally {
    yield put(setLoading(false));
  }
}
