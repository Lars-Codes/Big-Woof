import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { removeClients, setLoading } from '../../../state/clients/clientsSlice';
import processClientResultSet from '../processClientResultSet/processClientResultSet';
import processClientSearchResultSet from '../processClientSearchResultSet/processClientSearchResultSet';

export default function* deleteClients(action) {
  const { clientIds, onSuccess, onError } = action.payload;

  try {
    yield put(setLoading(true));
    const res = yield call(api, '/deleteClient', 'DELETE', {
      clientid_arr: clientIds,
    });

    if (res?.success) {
      yield put(removeClients(clientIds));
      yield call(processClientResultSet);
      yield call(processClientSearchResultSet);

      if (onSuccess && typeof onSuccess === 'function') {
        yield call(onSuccess, res);
      }
    } else {
      console.error('Failed to delete clients:', res);
      if (onError && typeof onError === 'function') {
        yield call(onError, res);
      }
    }

    return res;
  } catch (error) {
    console.error('Error deleting clients:', error);
    if (onError && typeof onError === 'function') {
      yield call(onError, error);
    }
  } finally {
    yield put(setLoading(false));
  }
}
