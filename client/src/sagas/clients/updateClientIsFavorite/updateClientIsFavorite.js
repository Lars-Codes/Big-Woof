import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setClientFavorite } from '../../../state/clientDetails/clientDetailsSlice';
import { updateClientFavorite } from '../../../state/clients/clientsSlice';

export default function* updateClientIsFavorite(action) {
  const { clientId, isFavorite } = action.payload;

  try {
    // Update Redux state immediately for instant UI feedback
    yield put(updateClientFavorite({ clientId, isFavorite }));

    // Also update client details if viewing that client
    yield put(setClientFavorite(isFavorite ? 1 : 0));

    // Then sync with server
    const formData = new FormData();
    formData.append('client_id', clientId);
    formData.append('favorite', isFavorite ? '1' : '0');

    const res = yield call(api, '/updateClientIsFavorite', 'PATCH', formData, {
      'Content-Type': 'multipart/form-data',
    });

    if (!res?.success === 1) {
      // If server update fails, revert the local change
      yield put(updateClientFavorite({ clientId, isFavorite: !isFavorite }));
      yield put(setClientFavorite(!isFavorite ? 1 : 0));
      console.error('Failed to update favorite status on server');
    }

    return res;
  } catch (error) {
    // If error occurs, revert the local change
    yield put(updateClientFavorite({ clientId, isFavorite: !isFavorite }));
    yield put(setClientFavorite(!isFavorite ? 1 : 0));
    console.error('Error updating client favorite status:', error);
  }
}
