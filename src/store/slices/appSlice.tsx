import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Theme } from "../../common/enums";
import { RootState } from "../store";

export interface AppState {
  theme: Theme;
}

const initialState: AppState = {
  theme: Theme.LIGHT,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
  },
});

export const { setAppTheme } = appSlice.actions;
export const selectAppTheme = (state: RootState) => state.app.theme;
export default appSlice.reducer;
