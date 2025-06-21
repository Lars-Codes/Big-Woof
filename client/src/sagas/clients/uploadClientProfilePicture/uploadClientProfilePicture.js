import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setLoading } from '../../../state/clientDetails/clientDetailsSlice';
import { fetchClientProfilePictureAction } from '../fetchClientProfilePicture/action';

export default function* uploadClientProfilePicture(action) {
  const { clientId, image, ext } = action.payload;
  try {
    // yield put(setLoading(true));
    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('image', image);
    formData.append('ext', ext);

    const res = yield call(api, '/uploadProfilePicture', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });
    if (res?.success === 1) {
      yield put(fetchClientProfilePictureAction(clientId));
    } else {
      console.error('Failed to upload profile picture:', res);
    }
  } catch (error) {
    console.error('Error uploading client profile picture:', error);
  } finally {
    yield put(setLoading(false));
  }
}
