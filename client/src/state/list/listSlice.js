import { createSlice } from '@reduxjs/toolkit';

export const listSlice = createSlice({
  name: 'list',
  initialState: {
    listType: 'Clients',
    hideHeaders: false,

    deleteMode: false,
  },
  reducers: {
    setListType: (state, action) => {
      state.listType = action.payload;
    },
    setHideHeaders: (state, action) => {
      state.hideHeaders = action.payload;
    },
  },
});

export const { setListType, setHideHeaders } = listSlice.actions;

export const selectListType = (state) => state.list.listType;
export const selectHideHeaders = (state) => state.list.hideHeaders;

export default listSlice.reducer;
