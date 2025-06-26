import { createAction } from '@reduxjs/toolkit';

export const DELETE_PET_PROFILE_PICTURE_ACTION_TYPE =
  'saga/deletePetProfilePicture';
export const deletePetProfilePictureAction = createAction(
  DELETE_PET_PROFILE_PICTURE_ACTION_TYPE,
);
