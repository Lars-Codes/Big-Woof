import { call, put, fork } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setClients, setLoading } from '../../../state/clients/clientsSlice';
import processResultSet from '../processResultSet/processResultSet';
import processSearchResultSet from '../processSearchResultSet/processSearchResultSet';

export default function* fetchClients() {
  try {
    yield put(setLoading(true));
    const res = yield call(api, '/getAllClients', 'GET');
    console.log('Response from API:', res);
    const clients = res.data;
    console.log('Fetched clients:', clients);
    yield put(setClients(clients));
    yield call(processResultSet);
    yield fork(processSearchResultSet);
  } catch (error) {
    console.error('Error fetching clients:', error);
  } finally {
    yield put(setLoading(false));
  }
}
