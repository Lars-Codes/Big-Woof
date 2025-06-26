import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { removeClients, setLoading } from '../../../state/clients/clientsSlice';
import processClientResultSet from '../processClientResultSet/processClientResultSet';
import processClientSearchResultSet from '../processClientSearchResultSet/processClientSearchResultSet';

export default function* deleteClient(action) {
  const clientIds = action.payload;
  try {
    // yield put(setLoading(true));
    const res = yield call(api, '/deleteClient', 'DELETE', {
      clientid_arr: clientIds,
    });
    if (res?.success) {
      yield put(removeClients(clientIds));
      yield call(processClientResultSet);
      yield call(processClientSearchResultSet);
    } else {
      console.error('Failed to delete client:', res);
    }
    return res;
  } catch (error) {
    console.error('Error deleting client:', error);
  } finally {
    yield put(setLoading(false));
  }
}
