//DELETE/deleteProfilePicture
import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setLoading } from '../../../state/clientDetails/clientDetailsSlice';
import { fetchClientProfilePictureAction } from '../fetchClientProfilePicture/action';

export default function* deleteClientProfilePicture(action) {
  const clientId = action.payload;
  try {
    // yield put(setLoading(true));
    const res = yield call(api, '/deleteProfilePicture', 'DELETE', {
      client_id: clientId,
    });
    if (res?.success === 1) {
      yield put(fetchClientProfilePictureAction(clientId));
    } else {
      console.error('Failed to delete profile picture:', res);
    }
  } catch (error) {
    console.error('Error deleting client profile picture:', error);
  } finally {
    yield put(setLoading(false));
  }
}
