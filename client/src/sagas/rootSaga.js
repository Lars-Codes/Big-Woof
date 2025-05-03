import { all, takeEvery, takeLatest, takeLeading } from "redux-saga/effects";

import { sagaMiddleware } from "../state/store";

import clientsFilteredBy from "./clients/clientsFilteredBy/clientsFilteredBy";
import { CLIENTS_FILTERED_BY_ACTION_TYPE } from "./clients/clientsFilteredBy/action";

export default function* rootSaga() {
  yield all([
    takeLeading(CLIENTS_FILTERED_BY_ACTION_TYPE, clientsFilteredBy),
    // take other actions here
  ]);
}

sagaMiddleware.run(rootSaga);
