import { call, put, select } from 'redux-saga/effects';
import { setItem } from '../../../services/storage';
import {
  selectClients,
  setFilteredBy,
} from '../../../state/clients/clientsSlice';
import processResultSet from '../processResultSet/processResultSet';
import processSearchResultSet from '../processSearchResultSet/processSearchResultSet';

export default function* clientsFilteredBy({ payload: filterBy }) {
  // will eventually use user id here
  setItem('filtered-by', filterBy);

  yield put(setFilteredBy(filterBy));

  const clients = yield select(selectClients);

  if (clients) {
    yield call(processResultSet);
    yield call(processSearchResultSet);
  }
}
