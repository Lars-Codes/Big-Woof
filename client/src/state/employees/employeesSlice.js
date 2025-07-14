import { createSlice } from '@reduxjs/toolkit';

export const employeesSlice = createSlice({
  name: 'employees',
  initialState: {
    loading: true,
    employees: [],
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
  },
});

export const { setLoading, setEmployees } = employeesSlice.actions;

export const selectLoading = (state) => state.employees.loading;
export const selectEmployees = (state) => state.employees.employees;

export default employeesSlice.reducer;
