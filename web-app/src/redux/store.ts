import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/es/storage";
import userReducer from "./ducks/user.duck";
import forumReducer from "./ducks/forum.duck";
import persistStore from "redux-persist/es/persistStore";
import toastReducer from "./ducks/toast.duck"
import modalReducer from "./ducks/modal.duck"
const persistConfig = {
  key: "user",
  whitelist: ["user"],
  storage,
};

const devToolAllow =
  process.env.NEXT_PUBLIC_API_URL == "development" ? true : false;

export const store = configureStore({
  reducer: persistReducer(
    persistConfig,
    combineReducers({
      user: userReducer,
      forum: forumReducer,
      toast:toastReducer,
      modal:modalReducer
    })
  ),
  devTools: devToolAllow,
  middleware: [],
});

export const persistor = persistStore(store);
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store;
