import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import {
  setLoading,
  setPetProfilePicture,
} from '../../../state/petDetails/petDetailsSlice';

export default function* fetchPetProfilePicture(action) {
  const petId = action.payload;
  try {
    yield put(setLoading(true));
    const res = yield call(api, `/getPetProfilePicture?pet_id=${petId}`, 'GET');
    if (res?.success === 1 && res?.exists === 1) {
      yield put(setPetProfilePicture(res.image_data));
    } else {
      yield put(setPetProfilePicture(null));
    }
  } catch (error) {
    if (error?.success === 0) {
      console.error('Error fetching pet profile picture:', error);
    }
    yield put(setPetProfilePicture(null));
  } finally {
    yield put(setLoading(false));
  }
}
