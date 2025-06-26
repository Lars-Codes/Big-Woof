import { createAction } from '@reduxjs/toolkit';

export const CREATE_BREED_ACTION_TYPE = 'saga/createBreed';
export const createBreedAction = createAction(CREATE_BREED_ACTION_TYPE);
