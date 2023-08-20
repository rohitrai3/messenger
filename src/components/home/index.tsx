import { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import {
  getAuthenticatedGoogleUserData,
  signOutUser,
} from "../../services/authenticate";
import {
  checkUidExist,
  checkUsernameExist,
  addUser,
  getUser,
  getUsername,
} from "../../services/database";
import {
  UserState,
  setUserIsAuthenticated,
  setUserName,
  setUserPhotoUrl,
  setUserUid,
  setUserUsername,
} from "../../store/slices/userSlice";
import HomeHeader, { HomeHeaderProps } from "./HomeHeader";
import Contacts, { ContactsProps } from "./Contacts";
import HomeFooter from "./HomeFooter";
import { UserType } from "../../common/enums";
import { AddUserInput, GoogleUserData } from "../../common/types";

export default function Home() {
  const [initializingUserState, setInitializingUserState] =
    useState<boolean>(true);
  const dispatch = useAppDispatch();

  const initializeUserState = async () => {
    console.log("Initializing user stata...");
    setInitializingUserState(true);
    const googleUserData: GoogleUserData = getAuthenticatedGoogleUserData();
    const username = await getUsername(googleUserData.uid);
    const userData = await getUser(username);
    dispatch(setUserUid(googleUserData.uid));
    dispatch(setUserUsername(username));
    dispatch(setUserName(userData.name));
    dispatch(setUserPhotoUrl(userData.photoUrl));
    sessionStorage.clear();
    console.log("...done initializing");
    setInitializingUserState(false);
  };

  const homeHeaderProps: HomeHeaderProps = {
    initializingUserState: initializingUserState,
  };

  const contactsProps: ContactsProps = {
    initializingUserState: initializingUserState,
  };

  useEffect(() => {
    initializeUserState();
  }, []);

  return (
    <div className="home background">
      <HomeHeader {...homeHeaderProps} />
      <Contacts {...contactsProps} />
      <HomeFooter />
    </div>
  );
}
