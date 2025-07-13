import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { fetchCoatTypesAction } from '../fetchCoatTypes/action';

export default function* createCoatType(action) {
  const { coatTypeData, onSuccess, onError } = action.payload;

  try {
    const formData = new FormData();
    Object.entries(coatTypeData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const res = yield call(api, '/createCoatType', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });

    if (res?.success) {
      // Refresh the coat types list
      yield put(fetchCoatTypesAction());

      if (onSuccess && typeof onSuccess === 'function') {
        yield call(onSuccess, res);
      }
    } else {
      console.error('Failed to create coat type:', res);
      if (onError && typeof onError === 'function') {
        yield call(onError, res);
      }
    }
    return res;
  } catch (error) {
    console.error('Error creating coat type:', error);
    if (onError && typeof onError === 'function') {
      yield call(onError, error);
    }
  }
}
