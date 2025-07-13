import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { fetchHairLengthsAction } from '../fetchHairLengths/action';

export default function* createHairLength(action) {
  const { hairLengthData, onSuccess, onError } = action.payload;

  try {
    // Use FormData like createBreed
    const formData = new FormData();
    Object.entries(hairLengthData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const res = yield call(api, '/createHairLength', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });

    if (res?.success) {
      // Refresh the hair lengths list
      yield put(fetchHairLengthsAction());

      if (onSuccess && typeof onSuccess === 'function') {
        yield call(onSuccess, res);
      }
    } else {
      console.error('Failed to create hair length:', res);
      if (onError && typeof onError === 'function') {
        yield call(onError, res);
      }
    }
    return res;
  } catch (error) {
    console.error('Error creating hair length:', error);
    if (onError && typeof onError === 'function') {
      yield call(onError, error);
    }
  }
}
