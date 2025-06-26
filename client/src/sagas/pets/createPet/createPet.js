import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setCreatePetResult } from '../../../state/pets/petsSlice';

export default function* createPet(action) {
  const { petData } = action.payload;
  try {
    const formData = new FormData();
    Object.entries(petData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    const res = yield call(api, '/createPet', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });
    yield put(setCreatePetResult(res));
  } catch (error) {
    console.error('Error creating pet:', error);
    yield put(
      setCreatePetResult({ success: 0, message: 'Error creating pet' }),
    );
  }
}
