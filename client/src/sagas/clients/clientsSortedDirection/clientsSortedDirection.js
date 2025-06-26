import { call, put, select } from 'redux-saga/effects';
import { setItem } from '../../../services/storage';
import {
  selectClients,
  setSortedDirection,
} from '../../../state/clients/clientsSlice';
import processClientResultSet from '../processClientResultSet/processClientResultSet';
import processClientSearchResultSet from '../processClientSearchResultSet/processClientSearchResultSet';

export default function* clientsSortedDirection({ payload: direction }) {
  // will eventully use user id here
  setItem('sorted-direction', direction);

  yield put(setSortedDirection(direction));

  const clients = yield select(selectClients);
  if (clients) {
    yield call(processClientResultSet);
    yield call(processClientSearchResultSet);
  }
}
