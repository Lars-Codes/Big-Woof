import { createAction } from '@reduxjs/toolkit';

export const DELETE_CLIENT_PROFILE_PICTURE_ACTION_TYPE =
  'saga/deleteClientProfilePicture';
export const deleteClientProfilePictureAction = createAction(
  DELETE_CLIENT_PROFILE_PICTURE_ACTION_TYPE,
);
