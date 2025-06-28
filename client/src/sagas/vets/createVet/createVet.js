import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';

export default function* createVet(action) {
  const { vetData } = action.payload;
  try {
    const formData = new FormData();
    Object.entries(vetData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    const res = yield call(api, '/createVet', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });
  } catch (error) {
    console.error('Error creating vet:', error);
  }
}
