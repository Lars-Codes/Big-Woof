import { createAction } from '@reduxjs/toolkit';

export const CREATE_PET_ACTION_TYPE = 'saga/createPet';
export const createPetAction = createAction(CREATE_PET_ACTION_TYPE);
