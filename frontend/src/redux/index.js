import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import teamReducer from "./team";
import userInfoReducer from "./user";
import fileReducer from "./file";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import socketioReducer from "./socketio";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["team", "file", "user", "socketio"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userInfoReducer,
  team: teamReducer,
  file: fileReducer,
  socketio: socketioReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
