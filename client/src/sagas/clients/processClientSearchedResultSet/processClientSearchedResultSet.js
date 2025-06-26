import { put, select } from 'redux-saga/effects';
import {
  selectClientsResultSet,
  setSearchedResultSet,
} from '../../../state/clients/clientsSlice';
import searchClients from '../../../utils/clients/searchClients';

export default function* processClientSearchedResultSet({
  payload: searchStr,
}) {
  const clientsResultSet = yield select(selectClientsResultSet);
  const searchResults = searchClients(searchStr, clientsResultSet);

  yield put(setSearchedResultSet(searchResults));
}
