import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { getAuthenticatedGoogleUserData } from "../services/authenticate";
import { getUserData, getUsername } from "../services/database";
import {
  UserState,
  setUserName,
  setUserPhotoUrl,
  setUserUid,
  setUserUsername,
} from "../store/slices/userSlice";
import { Dispatch } from "react";

export const setUserStateOnRefresh = async (
  dispatch: ThunkDispatch<
    {
      user: UserState;
    },
    undefined,
    AnyAction
  > &
    Dispatch<AnyAction>
) => {
  const googleUserData = getAuthenticatedGoogleUserData();
  const username = await getUsername(googleUserData.uid);
  const userData = await getUserData(username);
  dispatch(setUserUid(googleUserData.uid));
  dispatch(setUserUsername(username));
  dispatch(setUserName(userData.name));
  dispatch(setUserPhotoUrl(userData.photoUrl));
  sessionStorage.clear();
};
