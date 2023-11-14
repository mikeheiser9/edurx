import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";

interface toastDuckType {
  toastMessage: null | { msg: string; type: string };
}
const initialState: toastDuckType = {
  toastMessage: null,
};
const toast = createSlice({
  name: "toast",
  initialState: initialState,
  reducers: {
    setToast: (state, action: PayloadAction<toastDuckType>) => {
      state.toastMessage = action.payload.toastMessage;
    },
    removeToast: (state) => {
      state.toastMessage = null;
    },
  },
});

const { actions, reducer } = toast;
export const { removeToast, setToast } = actions;
export const selectToast = (state: AppState) => state.toast.toastMessage;
export default reducer;
