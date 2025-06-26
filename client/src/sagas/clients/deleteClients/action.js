import { createAction } from '@reduxjs/toolkit';

export const DELETE_CLIENTS_ACTION_TYPE = 'saga/deleteClients';
export const deleteClientsAction = createAction(DELETE_CLIENTS_ACTION_TYPE);
