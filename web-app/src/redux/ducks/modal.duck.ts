import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";

interface initialStateType {
  isOpen: boolean;
}
const initialState: initialStateType = {
  isOpen: false,
};
const modal = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    setModalState: (state, pageload: PayloadAction<initialStateType>) => {
      state.isOpen = pageload.payload.isOpen;
    },
  },
});
const { actions, reducer } = modal;
export const { setModalState } = actions;
export const selectModalState = (state: AppState) => state.modal.isOpen;
export default reducer;
