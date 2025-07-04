import { createAction } from '@reduxjs/toolkit';

export const DELETE_VET_ACTION_TYPE = 'saga/deleteVet';
export const deleteVetAction = createAction(DELETE_VET_ACTION_TYPE);
