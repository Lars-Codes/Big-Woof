import { createAction } from '@reduxjs/toolkit';

export const INIT_ACTION_TYPE = 'saga/init';
export const initAction = createAction(INIT_ACTION_TYPE);
