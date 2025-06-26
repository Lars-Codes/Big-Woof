import { createAction } from '@reduxjs/toolkit';

export const UPDATE_PET_ACTION_TYPE = 'saga/updatePet';
export const updatePetAction = createAction(UPDATE_PET_ACTION_TYPE);
