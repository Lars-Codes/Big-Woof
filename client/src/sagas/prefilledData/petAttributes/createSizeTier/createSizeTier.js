import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { setCreateSizeTierResult } from '../../../../state/pets/petsSlice';

export default function* createSizeTier(action) {
  try {
    const { sizeTierData } = action.payload;
    const formData = new FormData();
    Object.entries(sizeTierData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    const res = yield call(api, '/createSizeTier', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });
    yield put(setCreateSizeTierResult(res));
  } catch (error) {
    console.error('Error creating size tier:', error);
    yield put(
      setCreateSizeTierResult({
        success: 0,
        message: 'Error creating size tier',
      }),
    );
  }
}
