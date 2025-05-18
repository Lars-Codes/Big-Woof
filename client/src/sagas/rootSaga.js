import { all, takeEvery, takeLatest, takeLeading } from 'redux-saga/effects';

import { sagaMiddleware } from '../state/store';

import { CLIENTS_FILTERED_BY_ACTION_TYPE } from './clients/clientsFilteredBy/action';
import clientsFilteredBySaga from './clients/clientsFilteredBy/clientsFilteredBy';
import { CLIENTS_SEARCH_BY_ACTION_TYPE } from './clients/clientsSearchBy/action';
import clientsSearchBySaga from './clients/clientsSearchBy/clientsSearchBy';
import { CLIENTS_SORTED_BY_ACTION_TYPE } from './clients/clientsSortedBy/action';
import clientsSortedBySaga from './clients/clientsSortedBy/clientsSortedBy';
import { CLIENTS_SORTED_DIRECTION_ACTION_TYPE } from './clients/clientsSortedDirection/action';
import clientsSortedDirectionSaga from './clients/clientsSortedDirection/clientsSortedDirection';
import { FETCH_CLIENTS_ACTION_TYPE } from './clients/fetchClients/action';
import fetchClientsSaga from './clients/fetchClients/fetchClients';
import { PROCESSED_SEARCHED_RESULT_SET_TYPE } from './clients/processSearchedResultSet/action';
import processSearchedResultSetSaga from './clients/processSearchedResultSet/processSearchedResultSet';
import { INIT_ACTION_TYPE } from './init/action';
import initSaga from './init/init';
import { LOGGED_IN_ACTION_TYPE } from './loggedIn/action';
import loggedInSaga from './loggedIn/loggedIn';

export default function* rootSaga() {
  yield all([
    takeEvery(CLIENTS_SEARCH_BY_ACTION_TYPE, clientsSearchBySaga),
    takeEvery(CLIENTS_FILTERED_BY_ACTION_TYPE, clientsFilteredBySaga),
    takeEvery(CLIENTS_SORTED_BY_ACTION_TYPE, clientsSortedBySaga),
    takeEvery(CLIENTS_SORTED_DIRECTION_ACTION_TYPE, clientsSortedDirectionSaga),
    takeEvery(PROCESSED_SEARCHED_RESULT_SET_TYPE, processSearchedResultSetSaga),
    takeLatest(FETCH_CLIENTS_ACTION_TYPE, fetchClientsSaga),
    takeLeading(INIT_ACTION_TYPE, initSaga),
    takeLatest(LOGGED_IN_ACTION_TYPE, loggedInSaga),
  ]);
}

sagaMiddleware.run(rootSaga);
