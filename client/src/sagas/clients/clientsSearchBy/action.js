import { createAction } from "@reduxjs/toolkit";

export const CLIENTS_SEARCH_BY_ACTION_TYPE = 'saga/clientsSearchBy';
export const clientsSearchByAction = createAction(CLIENTS_SEARCH_BY_ACTION_TYPE);