import { call, put, select } from 'redux-saga/effects';
import {
  selectClients,
  setSearchBy,
} from '../../../state/clients/clientsSlice';
import processClientResultSet from '../processClientResultSet/processClientResultSet';
import processClientSearchResultSet from '../processClientSearchResultSet/processClientSearchResultSet';

export default function* clientsSearchBy({ payload: searchBy }) {
  yield put(setSearchBy(searchBy));

  const clients = yield select(selectClients);

  if (clients) {
    yield call(processClientResultSet);
    yield call(processClientSearchResultSet);
  }
}
