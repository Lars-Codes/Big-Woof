import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  setClientDetails,
  setLoading,
} from '../../../state/clientDetails/clientDetailsSlice';

export default function* fetchClientDetails(action, loading = false) {
  const clientId = action.payload;
  try {
    if (loading) yield put(setLoading(true));
    const res = yield call(
      api,
      `/getClientMetadata?client_id=${clientId}`,
      'GET',
    );
    const clientDetails = res.data;
    yield put(setClientDetails(clientDetails));
  } catch (error) {
    console.error('Error fetching client metadata:', error);
  } finally {
    yield put(setLoading(false));
  }
}
