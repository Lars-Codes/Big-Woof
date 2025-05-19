import { createAction } from '@reduxjs/toolkit';

export const FETCH_CLIENT_PROFILE_PICTURE_ACTION_TYPE =
  'saga/fetchClientProfilePicture';
export const fetchClientProfilePictureAction = createAction(
  FETCH_CLIENT_PROFILE_PICTURE_ACTION_TYPE,
);
