import { createAction } from '@reduxjs/toolkit';

export const FETCH_BREEDS_ACTION_TYPE = 'saga/fetchBreeds';
export const fetchBreedsAction = createAction(FETCH_BREEDS_ACTION_TYPE);
