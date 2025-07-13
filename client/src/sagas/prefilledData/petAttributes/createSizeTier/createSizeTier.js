import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { fetchSizeTiersAction } from '../fetchSizeTiers/action';

export default function* createSizeTier(action) {
  const { sizeTierData, onSuccess, onError } = action.payload;

  try {
    const formData = new FormData();
    Object.entries(sizeTierData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const res = yield call(api, '/createSizeTier', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });

    if (res?.success) {
      // Refresh the size tiers list
      yield put(fetchSizeTiersAction());

      if (onSuccess && typeof onSuccess === 'function') {
        yield call(onSuccess, res);
      }
    } else {
      console.error('Failed to create size tier:', res);
      if (onError && typeof onError === 'function') {
        yield call(onError, res);
      }
    }
    return res;
  } catch (error) {
    console.error('Error creating size tier:', error);
    if (onError && typeof onError === 'function') {
      yield call(onError, error);
    }
  }
}
