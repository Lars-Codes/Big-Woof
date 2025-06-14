import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  setClientDocuments,
  setLoading,
} from '../../../state/clientDetails/clientDetailsSlice';

export default function* fetchClientDocuments(action) {
  const clientId = action.payload;
  try {
    yield put(setLoading(true));
    const res = yield call(
      api,
      `/getClientDocumentsMetadata?client_id=${clientId}`,
      'GET',
    );
    const clientDocuments = res.data;
    yield put(setClientDocuments(clientDocuments));
  } catch (error) {
    console.error('Error fetching client documents:', error);
  } finally {
    yield put(setLoading(false));
  }
}
