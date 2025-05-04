import { createAction } from "@reduxjs/toolkit";

export const CLIENTS_SORTED_BY_ACTION_TYPE = "saga/clientsSortedBy";
export const clientsSortedByAction = createAction(
  CLIENTS_SORTED_BY_ACTION_TYPE
);
