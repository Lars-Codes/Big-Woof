import { call } from 'redux-saga/effects';
import loggedIn from '../loggedIn/loggedIn';

export default function* initSaga() {
  try {
    yield call(loggedIn);
  } catch (error) {
    console.error('Failed to handle init:', error);
  }
}
