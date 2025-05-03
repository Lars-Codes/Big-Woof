import { createAction } from "@reduxjs/toolkit";

export const CLIENTS_FILTERED_BY_ACTION_TYPE = "saga/clientsFilteredBy";
export const clientsFilteredByAction = createAction(
  CLIENTS_FILTERED_BY_ACTION_TYPE
);
