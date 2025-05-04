import { all, takeEvery, takeLatest, takeLeading } from "redux-saga/effects";

import { sagaMiddleware } from "../state/store";

import clientsFilteredBy from "./clients/clientsFilteredBy/clientsFilteredBy";
import { CLIENTS_FILTERED_BY_ACTION_TYPE } from "./clients/clientsFilteredBy/action";
import clientsSearchBy from "./clients/clientsSearchBy/clientsSearchBy";
import { CLIENTS_SEARCH_BY_ACTION_TYPE } from "./clients/clientsSearchBy/action";
import clientsSortedBy from "./clients/clientsSortedBy/clientsSortedBy";
import { CLIENTS_SORTED_BY_ACTION_TYPE } from "./clients/clientsSortedBy/action";
import clientsSortedDirection from "./clients/clientsSortedDirection/clientsSortedDirection";
import { CLIENTS_SORTED_DIRECTION_ACTION_TYPE } from "./clients/clientsSortedDirection/action";
import processSearchedResultSet from "./clients/processSearchedResultSet/processSearchedResultSet";
import { PROCESSED_SEARCHED_RESULT_SET_TYPE } from "./clients/processSearchedResultSet/action";

import loggedInSaga from "./loggedIn/loggedIn";
import { LOGGED_IN_ACTION_TYPE } from "./loggedIn/action";

export default function* rootSaga() {
  yield all([
    takeEvery(CLIENTS_SEARCH_BY_ACTION_TYPE, clientsSearchBy),
    takeEvery(CLIENTS_FILTERED_BY_ACTION_TYPE, clientsFilteredBy),
    takeEvery(CLIENTS_SORTED_BY_ACTION_TYPE, clientsSortedBy),
    takeEvery(CLIENTS_SORTED_DIRECTION_ACTION_TYPE, clientsSortedDirection),
    takeEvery(PROCESSED_SEARCHED_RESULT_SET_TYPE, processSearchedResultSet),
    takeLatest(LOGGED_IN_ACTION_TYPE, loggedInSaga),
    // take other actions here
  ]);
}

sagaMiddleware.run(rootSaga);
