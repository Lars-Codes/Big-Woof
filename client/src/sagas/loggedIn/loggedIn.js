import { call, fork } from "redux-saga/effects";
import postLogin from "../postLogin/postLogin";

export default function* loggedIn() {
  try {
    // Call postLogin saga to handle post-login actions
    yield call(postLogin);
  } catch (error) {
    console.error("Failed to handle loggedIn:", error);
  }
}
