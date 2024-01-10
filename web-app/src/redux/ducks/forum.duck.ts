import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../store";

interface InitialState {
  selectedForumFilters: FilterOptionsState | null;
  activeLeftPanelTab: any;
}

const initialState: InitialState = {
  selectedForumFilters: null,
  activeLeftPanelTab: null,
};

const forum = createSlice({
  name: "forum",
  initialState,
  reducers: {
    setSelectedFilter: (state, payload: PayloadAction<FilterOptionsState>) => {
      state.selectedForumFilters = payload.payload;
    },
    setActiveLeftPanelTab: (state, payload: PayloadAction<any>) => {
      state.activeLeftPanelTab = payload.payload;
    },
  },
});
const { actions, reducer } = forum;
export const { setSelectedFilter, setActiveLeftPanelTab } = actions;
export const getSelectedForumFilters = (state: AppState) =>
  state.forum.selectedForumFilters;
export const getActiveLeftPanelTab = (state: AppState) =>
  state?.forum?.activeLeftPanelTab;

export default reducer;
