import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";
interface userDetailsType {
  _id: null | string;
  first_name: null | string;
  last_name: null | string;
  email: null | string;
  password: null | string;
  role: null | string;
  // npi_designation: null | string;
  verified_account: null | string;
  // joined: null | string;
}
interface initialStateType {
  token: string | null;
  details: userDetailsType | null;
  draftsCount: number;
}
const initialState: initialStateType = {
  token: null,
  details: {
    _id: null,
    first_name: null,
    last_name: null,
    email: null,
    password: null,
    role: null,
    // npi_designation: null,
    verified_account: null,
    // joined: null,
  },
  draftsCount: 0,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetail: (state, payload: PayloadAction<userDetailsType>) => {
      state.details = payload.payload;
    },
    setToken: (state, payload: PayloadAction<string>) => {
      state.token = payload.payload;
    },
    removeUserDetail: (state) => {
      state.details = null;
    },
    removeToken: (state) => {
      state.token = null;
    },
    setDraftCount: (states, payload: PayloadAction<number>) => {
      states.draftsCount = payload.payload;
    },
  },
});
const { actions, reducer } = user;
export const {
  removeToken,
  removeUserDetail,
  setToken,
  setUserDetail,
  setDraftCount,
} = actions;
export const selectToken = (state: AppState) => state.user.token;
export const selectUserDetail = (state: AppState) => state.user.details;
export const selectDraftCount = (state: AppState) => state.user.draftsCount;
export default reducer;
