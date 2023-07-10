import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface UserState {
  uid: string;
  username: string;
  name: string;
  photoUrl: string;
}

const initialState: UserState = {
  uid: "Unknown",
  username: "Unknown",
  name: "Unknown",
  photoUrl: "Unknown",
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
  },
});

export const { setUserUid, setUserUsername, setUserName, setUserPhotoUrl } =
  userSlice.actions;
export const selectUserUid = (state: RootState) => state.user.uid;
export const selectUserUsername = (state: RootState) => state.user.username;
export const selectUserName = (state: RootState) => state.user.name;
export const selectUserPhotoUrl = (state: RootState) => state.user.photoUrl;
export default userSlice.reducer;
