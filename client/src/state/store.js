import { configureStore } from '@reduxjs/toolkit';
import clientDetailsReducer from './clientDetails/clientDetailsSlice';
import clientsReducer from './clients/clientsSlice';
const createSagaMiddleware = require('redux-saga').default;

export const sagaMiddleware = createSagaMiddleware();

const reducers = {
  clients: clientsReducer,
  clientDetails: clientDetailsReducer,
};

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).prepend(sagaMiddleware),
});

export default store;
