import { configureStore } from '@reduxjs/toolkit';
import clientsReducer from './clients/clientsSlice';
const createSagaMiddleware = require('redux-saga').default;

export const sagaMiddleware = createSagaMiddleware();

const reducers = {
  clients: clientsReducer,
  // Uncomment these as you implement them
  // appointments: appointmentsReducer,
  // services: servicesReducer,
  // groomer: groomerReducer,
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
