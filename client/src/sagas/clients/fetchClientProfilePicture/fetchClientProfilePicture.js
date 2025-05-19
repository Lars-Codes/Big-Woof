import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  setClientProfilePicture,
  setLoading,
} from '../../../state/clientDetails/clientDetailsSlice';

export default function* fetchClientProfilePicture(action) {
  const clientId = action.payload;

  try {
    yield put(setLoading(true));
    const res = yield call(
      api,
      `/getProfilePicture?client_id=${clientId}`,
      'GET',
    );
    const clientProfilePicture = res.data;
    yield put(setClientProfilePicture(clientProfilePicture));
  } catch (error) {
    if (error.success === 1) {
      yield put(setClientProfilePicture(null));
    } else {
      console.error('Error fetching client profile picture:', error);
    }
  } finally {
    yield put(setLoading(false));
  }
}
