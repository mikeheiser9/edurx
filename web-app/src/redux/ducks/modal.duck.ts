import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";

type modalType = {
  isOpen: boolean;
  type: string;
};
interface initialStateType {
  modal: modalType;
}
const initialState: initialStateType = {
  modal: {
    isOpen: false,
    type: "",
  },
};
const modal = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    setModalState: (state, payload: PayloadAction<modalType>) => {
      state.modal = payload.payload;
    },
    resetModalState: (state) => {
      state.modal = initialState.modal;
    },
  },
});
const { actions, reducer } = modal;
export const { setModalState, resetModalState } = actions;
export const selectModalState = (state: AppState): modalType =>
  state.modal.modal;
export default reducer;
