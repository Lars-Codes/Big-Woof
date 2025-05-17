import { call } from 'redux-saga/effects';
import postLogin from '../postLogin/postLogin';

export default function* loggedIn() {
  try {
    // functions to be called to log in
    // log in would be here..
    yield call(postLogin);
  } catch (error) {
    console.error('Failed to handle loggedIn:', error);
  }
}
