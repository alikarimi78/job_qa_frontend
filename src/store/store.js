import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { baseApi } from "@services/baseApi";
import authReducer from "./slices/authSlice";

// Only the session is persisted. The RTK Query cache deliberately is not: a rehydrated
// list of accounts or pending suggestions would be shown as current while the server has
// long since moved on, and refetching it costs one request.
const persistedAuth = persistReducer(
  { key: "auth", storage, whitelist: ["token", "role", "username", "userInfo"] },
  authReducer
);

const rootReducer = combineReducers({
  auth: persistedAuth,
  [baseApi.reducerPath]: baseApi.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-persist dispatches non-serializable actions by design
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
export default store;
