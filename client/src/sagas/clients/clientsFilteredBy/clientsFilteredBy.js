import { call, put, select } from "redux-saga/effects";
import {
  selectClients,
  setFilteredBy,
  setContactsResultSet,
} from "../../../state/clients/clientsSlice";
import { setItem } from "../../../services/storage";

export default function* clientsFilteredBy({ payload: filteredBy }) {
  setItem("filteredBy", filteredBy);

  yield put(setFilteredBy(filteredBy));

  const clients = yield select(selectClients);

  yield put(
    setContactsResultSet(clients.filter((client) => client.type === filteredBy))
  );
}
