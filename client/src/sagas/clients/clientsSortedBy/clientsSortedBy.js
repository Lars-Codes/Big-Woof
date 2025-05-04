import { call, put, select } from "redux-saga/effects";
import {
  selectClients,
  setSortedBy,
} from "../../../state/clients/clientsSlice";
import { setItem } from "../../../services/storage";
import processResultSet from "../processResultSet/processResultSet";
import processSearchResultSet from "../processSearchResultSet/processSearchResultSet";

export default function* clientsSortedBy({ payload: sortBy }) {
  // will eventully use user id here
  setItem("sorted-by", sortBy);

  yield put(setSortedBy(sortBy));

  const clients = yield select(selectClients);
  if (clients) {
    yield call(processResultSet);
    yield call(processSearchResultSet);
  }
}
