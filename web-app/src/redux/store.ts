import { combineReducers, configureStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage"
import userReducer from "./ducks/user.duck"
import persistStore from "redux-persist/es/persistStore";
const persistConfig={
    key:"user",
    storage
}
const devToolAllow=process.env.NEXT_PUBLIC_API_URL=="development"?true:false;
export const store=configureStore({
    reducer:persistReducer(persistConfig,combineReducers({
         user:userReducer
    })),
    devTools:devToolAllow,
    middleware:[]
})
export const persistor=persistStore(store);
export type AppState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store;