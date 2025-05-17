import { put, call, select } from 'redux-saga/effects';
import * as clientState from '../../../state/clients/clientsSlice';
import getClientResultSet from '../../../utils/clients/getClientResultSet';

export default function* processResultSet(updateLoading = false) {
  const clientsArr = yield select(clientState.selectClients);
  const filteredBy = yield select(clientState.selectFilteredBy);
  const sortedBy = yield select(clientState.selectSortedBy);
  const sortedDirection = yield select(clientState.selectSortedDirection);

  const clientsList = yield call(
    getClientResultSet,
    clientsArr,
    filteredBy,
    sortedBy,
    sortedDirection,
  );

  // dispatch result set
  yield put(clientState.setClientsResultSet(clientsList));

  if (updateLoading) {
    yield put(clientState.setLoading(false));
  }
}
