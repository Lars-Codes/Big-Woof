import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setLoading } from '../../../state/petDetails/petDetailsSlice';
import { fetchPetProfilePictureAction } from '../fetchPetProfilePicture/action';

export default function* uploadPetProfilePicture(action) {
  const { petId, image, ext, onSuccess, onError } = action.payload;
  try {
    // yield put(setLoading(true));
    const formData = new FormData();
    formData.append('pet_id', petId);
    formData.append('image', image);
    formData.append('ext', ext);

    const res = yield call(api, '/uploadPetProfilePicture', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });
    if (res?.success === 1) {
      yield put(fetchPetProfilePictureAction(petId));
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(res);
      }
    } else {
      console.error('Failed to upload pet profile picture:', res);
      // Call error callback if provided
      if (onError) {
        onError(res?.message || 'Failed to upload pet profile picture');
      }
    }
  } catch (error) {
    console.error('Error uploading pet profile picture:', error);
    // Call error callback if provided
    if (onError) {
      onError(error.message || 'Network error occurred');
    }
  } finally {
    yield put(setLoading(false));
  }
}
