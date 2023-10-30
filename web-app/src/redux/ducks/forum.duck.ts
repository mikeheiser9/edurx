import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";

interface InitialState {
  selectedForumFilters: FilterOptionsState | null;
}

const initialState: InitialState = {
  selectedForumFilters: null,
};

const forum = createSlice({
  name: "forum",
  initialState,
  reducers: {
    setSelectedFilter: (state, payload: PayloadAction<FilterOptionsState>) => {
      state.selectedForumFilters = payload.payload;
    },
  },
});
const { actions, reducer } = forum;
export const { setSelectedFilter } = actions;
export const getSelectedForumFilters = (state: AppState) =>
  state.forum.selectedForumFilters;

export default reducer;
