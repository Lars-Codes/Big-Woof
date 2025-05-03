import { call, delya, fork, put, select } from "redux-saga/effects";

import fetchClients from "../clients/fetchClients/fetchClients";

export default function* postLogin() {
  try {
    // Fetch clients after login
    yield fork(fetchClients);
  } catch (error) {
    console.error("Failed to post login:", error);
  }
}
