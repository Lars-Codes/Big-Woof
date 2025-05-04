import { put, select } from "redux-saga/effects";
import {
  selectClientsResultSet,
  setSearchedResultSet,
} from "../../../state/clients/clientsSlice";
import searchClients from "../../../utils/clients/searchClients";

export default function* processSearchedResultSet({ payload: searchStr }) {
  const clientsResultSet = yield select(selectClientsResultSet);
  const searchResults = searchClients(searchStr, clientsResultSet);

  console.log("searching for", searchStr);
  console.log("searchResults", searchResults);

  yield put(setSearchedResultSet(searchResults));
}
