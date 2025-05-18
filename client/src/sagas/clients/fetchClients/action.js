import { createAction } from '@reduxjs/toolkit';

export const FETCH_CLIENTS_ACTION_TYPE = 'saga/fetchClients';
export const fetchClientsAction = createAction(FETCH_CLIENTS_ACTION_TYPE);
