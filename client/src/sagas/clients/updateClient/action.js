import { createAction } from '@reduxjs/toolkit';

export const UPDATE_CLIENT_ACTION_TYPE = 'saga/updateClient';
export const updateClientAction = createAction(UPDATE_CLIENT_ACTION_TYPE);
