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
    if (res?.success === 1 && res?.exists === 1) {
      yield put(setClientProfilePicture(res.image_data));
    } else {
      yield put(setClientProfilePicture(null));
    }
  } catch (error) {
    if (error?.success === 0) {
      console.error('Error fetching client profile picture:', error);
    }
    yield put(setClientProfilePicture(null));
  } finally {
    yield put(setLoading(false));
  }
}
