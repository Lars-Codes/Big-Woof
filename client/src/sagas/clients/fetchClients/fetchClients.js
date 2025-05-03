import { setClients, setLoading } from "../../../state/clients/clientsSlice";
import { call, put } from "redux-saga/effects";
import { api } from "../../../services/api";

export default function* fetchClients() {
  try {
    yield put(setLoading(true));
    const res = yield call(api, "/getAllClients", "GET");
    const clients = res.data;
    yield put(setClients(clients));
  } catch (error) {
    console.error("Error fetching clients:", error);
  } finally {
    yield put(setLoading(false));
  }
}