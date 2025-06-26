import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setPetDeceased } from '../../../state/petDetails/petDetailsSlice';
import { updatePetDeceased } from '../../../state/pets/petsSlice';

export default function* updatePetIsDeceased(action) {
  const { petId, isDeceased } = action.payload;

  try {
    // Update Redux state immediately for instant UI feedback
    yield put(updatePetDeceased({ petId, isDeceased }));

    // Also update pet details if viewing that pet
    yield put(setPetDeceased(isDeceased ? 1 : 0));

    // Then sync with server
    const formData = new FormData();
    formData.append('pet_id', petId);
    formData.append('deceased', isDeceased ? '1' : '0');

    const res = yield call(api, '/changeDeceasedStatus', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });

    if (!res?.success === 1) {
      // If server update fails, revert the local change
      yield put(updatePetDeceased({ petId, isDeceased: !isDeceased }));
      yield put(setPetDeceased(!isDeceased ? 1 : 0));
      console.error('Failed to update deceased status on server');
    }
    return res;
  } catch (error) {
    // If error occurs, revert the local change
    yield put(updatePetDeceased({ petId, isDeceased: !isDeceased }));
    yield put(setPetDeceased(!isDeceased ? 1 : 0));
    console.error('Error updating pet deceased status:', error);
  }
}
