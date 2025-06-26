import { createAction } from '@reduxjs/toolkit';

export const DELETE_PETS_ACTION_TYPE = 'saga/deletePets';
export const deletePetsAction = createAction(DELETE_PETS_ACTION_TYPE);
