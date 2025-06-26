import { call, put, fork } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setClients, setLoading } from '../../../state/clients/clientsSlice';
import processClientResultSet from '../processClientResultSet/processClientResultSet';
import processClientSearchResultSet from '../processClientSearchResultSet/processClientSearchResultSet';

export default function* fetchClients() {
  try {
    yield put(setLoading(true));
    const res = yield call(api, '/getAllClients', 'GET');
    const clients = res.data;
    yield put(setClients(clients));
    yield call(processClientResultSet);
    yield fork(processClientSearchResultSet);
  } catch (error) {
    console.error('Error fetching clients:', error);
  } finally {
    yield put(setLoading(false));
  }
}
