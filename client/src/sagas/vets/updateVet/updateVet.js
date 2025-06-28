import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';

export default function* updateVet(action) {
  const { vetData } = action.payload;
  try {
    const formData = new FormData();
    formData.append('vet_id', vetData.vet_id);
    Object.entries(vetData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const res = yield call(api, '/updateVetContact', 'PATCH', formData, {
      'Content-Type': 'multipart/form-data',
    });
  } catch (error) {
    console.error('Error updating vet:', error);
  }
}
