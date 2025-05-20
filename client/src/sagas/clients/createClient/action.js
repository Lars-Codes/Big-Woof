import { createAction } from '@reduxjs/toolkit';

export const CREATE_CLIENT_ACTION_TYPE = 'saga/createClient';
export const createClientAction = createAction(CREATE_CLIENT_ACTION_TYPE);
