import { createAction } from "@reduxjs/toolkit";

export const LOGGED_IN_ACTION_TYPE = "saga/loggedIn";
export const loggedInAction = createAction(LOGGED_IN_ACTION_TYPE);
