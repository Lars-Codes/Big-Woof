import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { removeClient } from '../../../state/clients/clientsSlice';
import processResultSet from '../processResultSet/processResultSet';
import processSearchResultSet from '../processSearchResultSet/processSearchResultSet';

export default function* deleteClient(action) {
  const clientIds = action.payload;
  try {
    const res = yield call(api, '/deleteClient', 'DELETE', {
      clientid_arr: clientIds,
    });
    if (res?.success) {
      for (const id of clientIds) {
        yield put(removeClient(id));
      }
      yield call(processResultSet);
      yield call(processSearchResultSet);
    }
    return res;
  } catch (error) {
    console.error('Error deleting client:', error);
  }
}
