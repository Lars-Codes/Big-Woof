import { call, put, select } from "redux-saga/effects";
import {
  selectClients,
  setSearchBy,
} from "../../../state/clients/clientsSlice";
import processResultSet from "../processResultSet/processResultSet";
import processSearchResultSet from "../processSearchResultSet/processSearchResultSet";

export default function* clientsSearchBy({ payload: searchBy }) {
  yield put(setSearchBy(searchBy));

  const clients = yield select(selectClients);

  if (clients) {
    yield call(processResultSet);
    yield call(processSearchResultSet);
  }
}
