import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface UserState {
  uid: string;
  username: string;
  name: string;
  photoUrl: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  uid: "",
  username: "",
  name: "",
  photoUrl: "",
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserUid: (state, action: PayloadAction<string>) => {
      state.uid = action.payload;
    },
    setUserUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setUserPhotoUrl: (state, action: PayloadAction<string>) => {
      state.photoUrl = action.payload;
    },
    setUserIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const {
  setUserUid,
  setUserUsername,
  setUserName,
  setUserPhotoUrl,
  setUserIsAuthenticated,
} = userSlice.actions;
export const selectUserUid = (state: RootState) => state.user.uid;
export const selectUserUsername = (state: RootState) => state.user.username;
export const selectUserName = (state: RootState) => state.user.name;
export const selectUserPhotoUrl = (state: RootState) => state.user.photoUrl;
export const selectUserIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export default userSlice.reducer;
