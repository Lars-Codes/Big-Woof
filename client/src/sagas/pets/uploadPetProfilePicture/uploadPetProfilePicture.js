import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setLoading } from '../../../state/petDetails/petDetailsSlice';
import { fetchPetProfilePictureAction } from '../fetchPetProfilePicture/action';

export default function* uploadPetProfilePicture(action) {
  const { petId, image, ext } = action.payload;
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
    } else {
      console.error('Failed to upload pet profile picture:', res);
    }
  } catch (error) {
    console.error('Error uploading pet profile picture:', error);
  } finally {
    yield put(setLoading(false));
  }
}
