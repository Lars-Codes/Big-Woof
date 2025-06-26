import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setUpdatePetResult } from '../../../state/pets/petsSlice';

export default function* updatePet(action) {
  const { petData } = action.payload;
  try {
    const formData = new FormData();
    formData.append('pet_id', petData.pet_id);

    // Append only fields that exist in petData
    Object.entries(petData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const res = yield call(api, '/editPetBasicData', 'PATCH', formData, {
      'Content-Type': 'multipart/form-data',
    });

    yield put(setUpdatePetResult(res));
  } catch (error) {
    console.error('Error updating pet:', error);
    yield put(
      setUpdatePetResult({ success: 0, message: 'Error updating pet' }),
    );
  }
}
