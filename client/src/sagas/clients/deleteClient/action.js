import { createAction } from '@reduxjs/toolkit';

export const DELETE_CLIENT_ACTION_TYPE = 'saga/deleteClient';
export const deleteClientAction = createAction(DELETE_CLIENT_ACTION_TYPE);
