import { setClients, setLoading } from "../../../state/clients/clientsSlice";
import { call, put } from "redux-saga/effects";
import { api } from "../../../services/api";

export default function* fetchClients() {
  try {
    yield put(setLoading(true));
    const res = yield call(api, "/clients", null, "GET", {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    });
    yield put(setClients(res));
  } catch (error) {
    console.error("Failed to fetch clients:", error);
  } finally {
    yield put(setLoading(false));
  }
}
