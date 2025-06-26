import { createAction } from '@reduxjs/toolkit';

export const FETCH_PET_PROFILE_PICTURE_ACTION_TYPE =
  'saga/fetchPetProfilePicture';
export const fetchPetProfilePictureAction = createAction(
  FETCH_PET_PROFILE_PICTURE_ACTION_TYPE,
);
