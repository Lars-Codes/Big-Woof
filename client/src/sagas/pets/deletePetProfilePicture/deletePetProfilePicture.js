//DELETE/deleteProfilePicture
import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setLoading } from '../../../state/petDetails/petDetailsSlice';
import { fetchPetProfilePictureAction } from '../fetchPetProfilePicture/action';

export default function* deletePetProfilePicture(action) {
  const { petId, onSuccess, onError } = action.payload;

  try {
    // yield put(setLoading(true));
    const res = yield call(api, '/deletePetProfilePicture', 'DELETE', {
      pet_id: petId,
    });
    if (res?.success === 1) {
      // Refresh the profile picture
      yield put(fetchPetProfilePictureAction(petId));
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(res);
      }
    } else {
      console.error('Failed to delete pet profile picture:', res);
      // Call error callback if provided
      if (onError) {
        onError(res?.message || 'Failed to delete pet profile picture');
      }
    }
  } catch (error) {
    console.error('Error deleting pet profile picture:', error);
    // Call error callback if provided
    if (onError) {
      onError(error.message || 'Network error occurred');
    }
  } finally {
    yield put(setLoading(false));
  }
}
