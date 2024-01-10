import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./ducks/user.duck";
import toastReducer from "./ducks/toast.duck"
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
const persistConfig = {
  key: "user",
  whitelist: ["user"],
  storage,
};
const MiddleWares: any = [];
const devToolAllow =
  process.env.NEXT_PUBLIC_API_URL == "development" ? true : false;

export const store = configureStore({
  reducer: persistReducer(
    persistConfig,
    combineReducers({
      user: userReducer,
      toast:toastReducer,
    })
  ),
  devTools: devToolAllow,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
      thunk: false,
    }).concat(MiddleWares);
  },
});

export const persistor = persistStore(store);
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store;
