import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";

interface InitialState {
  selectedResFilters: FilterOptionsState | null;
}

const initialState: InitialState = {
  selectedResFilters: null,
};

const forum = createSlice({
  name: "resource",
  initialState,
  reducers: {
    setSelectedFilter: (state, payload: PayloadAction<FilterOptionsState>) => {
      state.selectedResFilters = payload.payload;
    },
  },
});
const { actions, reducer } = forum;
export const { setSelectedFilter } = actions;
export const getSelectedResFilters = (state: AppState) =>
  state.forum.selectedResFilters;

export default reducer;
