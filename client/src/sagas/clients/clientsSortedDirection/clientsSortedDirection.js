import { call, put, select } from 'redux-saga/effects';
import { setItem } from '../../../services/storage';
import {
  selectClients,
  setSortedDirection,
} from '../../../state/clients/clientsSlice';
import processResultSet from '../processResultSet/processResultSet';
import processSearchResultSet from '../processSearchResultSet/processSearchResultSet';

export default function* clientsSortedBy({ payload: direction }) {
  // will eventully use user id here
  setItem('sorted-direction', direction);

  yield put(setSortedDirection(direction));

  const clients = yield select(selectClients);
  if (clients) {
    yield call(processResultSet);
    yield call(processSearchResultSet);
  }
}
