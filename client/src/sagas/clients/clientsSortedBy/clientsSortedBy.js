import { call, put, select } from 'redux-saga/effects';
import { setItem } from '../../../services/storage';
import {
  selectClients,
  setSortedBy,
} from '../../../state/clients/clientsSlice';
import processClientResultSet from '../processClientResultSet/processClientResultSet';
import processClientSearchResultSet from '../processClientSearchResultSet/processClientSearchResultSet';

export default function* clientsSortedBy({ payload: sortBy }) {
  // will eventully use user id here
  setItem('sorted-by', sortBy);

  yield put(setSortedBy(sortBy));

  const clients = yield select(selectClients);
  if (clients) {
    yield call(processClientResultSet);
    yield call(processClientSearchResultSet);
  }
}
