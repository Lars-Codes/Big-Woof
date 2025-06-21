import { createAction } from '@reduxjs/toolkit';

export const UPLOAD_CLIENT_PROFILE_PICTURE_ACTION_TYPE =
  'saga/uploadClientProfilePicture';
export const uploadClientProfilePictureAction = createAction(
  UPLOAD_CLIENT_PROFILE_PICTURE_ACTION_TYPE,
);
