import { createAction } from '@reduxjs/toolkit';

export const UPDATE_PET_IS_DECEASED_ACTION_TYPE = 'saga/updatePetIsDeceased';
export const updatePetIsDeceasedAction = createAction(
  UPDATE_PET_IS_DECEASED_ACTION_TYPE,
);
