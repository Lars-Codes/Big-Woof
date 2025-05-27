import { initials } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { call, put } from 'redux-saga/effects';
import { api } from '../../../services/api';
import { setClientProfilePicture } from '../../../state/clientDetails/clientDetailsSlice';
import { setCreateClientResult } from '../../../state/clients/clientsSlice';

export default function* createClient(action) {
  const { clientData } = action.payload;
  try {
    const formData = new FormData();
    Object.entries(clientData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    const res = yield call(api, '/createClient', 'POST', formData, {
      'Content-Type': 'multipart/form-data',
    });
    if (res?.success) {
      const avatar = createAvatar(initials, {
        seed:
          (clientData.fname?.[0] || '') +
          (clientData.lname?.[0] || '') +
          res.client_id,
        width: 200,
        height: 200,
        radius: 100,
      });
      // Just store the SVG string
      yield put(setClientProfilePicture(avatar.toString()));
    }
    yield put(setCreateClientResult(res));
  } catch (error) {
    console.error('Error creating client:', error);
    yield put(
      setCreateClientResult({ success: 0, message: 'Error creating client' }),
    );
  }
}
