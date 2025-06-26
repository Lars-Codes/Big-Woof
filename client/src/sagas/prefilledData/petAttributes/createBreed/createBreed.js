import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { setCreateBreedResult } from '../../../../state/pets/petsSlice';

export default function* createBreed(action) {
  try {
    const { breedData } = action.payload;
    const formData = new FormData();
    Object.entries(breedData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    const res = yield call(api, '/createBreed', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });
    yield put(setCreateBreedResult(res));
  } catch (error) {
    console.error('Error creating breed:', error);
    yield put(
      setCreateBreedResult({
        success: 0,
        message: 'Error creating breed',
      }),
    );
  }
}
