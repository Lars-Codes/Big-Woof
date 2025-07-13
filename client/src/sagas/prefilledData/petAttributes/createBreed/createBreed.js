import { call, put } from 'redux-saga/effects';
import { api } from '../../../../services/api';
import { fetchBreedsAction } from '../fetchBreeds/action';

export default function* createBreed(action) {
  const { breedData, onSuccess, onError } = action.payload;

  try {
    const formData = new FormData();
    Object.entries(breedData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const res = yield call(api, '/createBreed', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });

    if (res?.success) {
      // Refresh the breeds list
      yield put(fetchBreedsAction());

      if (onSuccess && typeof onSuccess === 'function') {
        yield call(onSuccess, res);
      }
    } else {
      console.error('Failed to create breed:', res);
      if (onError && typeof onError === 'function') {
        yield call(onError, res);
      }
    }
    return res;
  } catch (error) {
    console.error('Error creating breed:', error);
    if (onError && typeof onError === 'function') {
      yield call(onError, error);
    }
  }
}
