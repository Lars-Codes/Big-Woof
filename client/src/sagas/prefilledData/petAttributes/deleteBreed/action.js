import { createAction } from '@reduxjs/toolkit';

export const DELETE_BREED_ACTION_TYPE = 'saga/deleteBreed';
export const deleteBreedAction = createAction(DELETE_BREED_ACTION_TYPE);
