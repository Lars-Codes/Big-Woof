import { createAction } from '@reduxjs/toolkit';

export const UPLOAD_PET_PROFILE_PICTURE_ACTION_TYPE =
  'saga/uploadPetProfilePicture';
export const uploadPetProfilePictureAction = createAction(
  UPLOAD_PET_PROFILE_PICTURE_ACTION_TYPE,
);
