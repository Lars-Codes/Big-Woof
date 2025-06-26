import { createAction } from '@reduxjs/toolkit';

export const FETCH_PETS_ACTION_TYPE = 'saga/fetchPets';
export const fetchPetsAction = createAction(FETCH_PETS_ACTION_TYPE);
