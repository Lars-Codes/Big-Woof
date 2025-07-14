import { createAction } from '@reduxjs/toolkit';

export const FETCH_EMPLOYEES_ACTION_TYPE = 'saga/fetchEmployees';
export const fetchEmployeesAction = createAction(FETCH_EMPLOYEES_ACTION_TYPE);
