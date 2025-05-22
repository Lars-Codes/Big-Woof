import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  setClientProfilePicture,
  setLoading,
} from '../../../state/clientDetails/clientDetailsSlice';

export default function* uploadProfilePicture(action) {
  const { clientId, image, ext } = action.payload;
  try {
    yield put(setLoading(true));
    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('image', image);
    formData.append('ext', ext);

    const res = yield call(api, '/uploadProfilePicture', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });
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
