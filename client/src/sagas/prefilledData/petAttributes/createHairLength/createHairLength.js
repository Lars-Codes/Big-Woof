import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { setCreateHairLengthResult } from '../../../../state/pets/petsSlice';

export default function* createHairLength(action) {
  try {
    const { hairLengthData } = action.payload;
    const formData = new FormData();
    Object.entries(hairLengthData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    const res = yield call(api, '/createHairLength', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });
    yield put(setCreateHairLengthResult(res));
  } catch (error) {
    console.error('Error creating hair length:', error);
    yield put(
      setCreateHairLengthResult({
        success: 0,
        message: 'Error creating hair length',
      }),
    );
  }
}
