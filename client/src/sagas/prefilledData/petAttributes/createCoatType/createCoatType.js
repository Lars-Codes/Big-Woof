import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { setCreateCoatTypeResult } from '../../../../state/pets/petsSlice';

export default function* createCoatType(action) {
  try {
    const { coatTypeData } = action.payload;
    const formData = new FormData();
    Object.entries(coatTypeData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    const res = yield call(api, '/createCoatType', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });
    yield put(setCreateCoatTypeResult(res));
  } catch (error) {
    console.error('Error creating coat type:', error);
    yield put(
      setCreateCoatTypeResult({
        success: 0,
        message: 'Error creating coat type',
      }),
    );
  }
}
