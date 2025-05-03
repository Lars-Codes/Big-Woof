import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../sagas/rootSaga";
import appointmentsReducer from "./appointments/appointmentsSlice";
import clientsReducer from "./clients/clientsSlice";
import servicesReducer from "./services/servicesSlice";
import groomerReducer from "./groomer/groomerSlice";

// Create saga middleware
export const sagaMiddleware = createSagaMiddleware();

const reducers = {
  appointments: appointmentsReducer,
  clients: clientsReducer,
  services: servicesReducer,
  groomer: groomerReducer,
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
