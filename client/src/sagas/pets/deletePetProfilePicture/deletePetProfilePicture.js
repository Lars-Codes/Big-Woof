//DELETE/deleteProfilePicture
import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setLoading } from '../../../state/petDetails/petDetailsSlice';
import { fetchPetProfilePictureAction } from '../fetchPetProfilePicture/action';

export default function* deletePetProfilePicture(action) {
  const petId = action.payload;
  try {
    // yield put(setLoading(true));
    const res = yield call(api, '/deletePetProfilePicture', 'DELETE', {
      pet_id: petId,
    });
    if (res?.success === 1) {
      yield put(fetchPetProfilePictureAction(petId));
    } else {
      console.error('Failed to delete pet profile picture:', res);
    }
  } catch (error) {
    console.error('Error deleting pet profile picture:', error);
  } finally {
    yield put(setLoading(false));
  }
}
