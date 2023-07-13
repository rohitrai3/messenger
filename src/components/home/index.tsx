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
  getUserData,
  getUsername,
} from "../../services/database";
import {
  UserState,
  setUserName,
  setUserPhotoUrl,
  setUserUid,
  setUserUsername,
} from "../../store/slices/userSlice";
import HomeHeader, { HomeHeaderProps } from "./HomeHeader";
import Contacts, { ContactsProps } from "./Contacts";
import HomeFooter from "./HomeFooter";
import { UserType } from "../../common/enums";
import { GoogleUserData } from "../../common/types";

export default function Home() {
  const [initializingUserState, setInitializingUserState] =
    useState<boolean>(true);
  const dispatch = useAppDispatch();

  const userAlreadyExist = () => {
    sessionStorage.setItem(
      "error",
      "User already exist. Please sign in as existing user."
    );
    signOutUser();
  };

  const usernameAlreadyTaken = () => {
    sessionStorage.setItem(
      "error",
      "Username already taken. Please try different username."
    );
    signOutUser();
  };

  const userNotExist = () => {
    sessionStorage.setItem(
      "error",
      "User does not exist. Please sign in as new user."
    );
    signOutUser();
  };

  const setUserState = async (uid: string) => {
    const username = await getUsername(uid);
    const userData = await getUserData(username);
    dispatch(setUserUid(uid));
    dispatch(setUserUsername(username));
    dispatch(setUserName(userData.name));
    dispatch(setUserPhotoUrl(userData.photoUrl));
    sessionStorage.clear();
  };

  const initializeUserState = async () => {
    setInitializingUserState(true);
    const googleUserData: GoogleUserData = getAuthenticatedGoogleUserData();
    const userType = sessionStorage.getItem("userType");
    if (userType) {
      if (userType === UserType.NEW.toString()) {
        const isUidExist = await checkUidExist(googleUserData.uid);

        if (isUidExist) {
          userAlreadyExist();
        } else {
          const isUsernameExist = await checkUsernameExist(
            sessionStorage.getItem("username")!
          );

          if (isUsernameExist) {
            usernameAlreadyTaken();
          } else {
            const newUserState: UserState = {
              uid: googleUserData.uid,
              username: sessionStorage.getItem("username")!,
              name: googleUserData.name,
              photoUrl: googleUserData.photoUrl,
            };
            await addUser(newUserState);
            await setUserState(googleUserData.uid);
          }
        }
      } else {
        const isUidExist = await checkUidExist(googleUserData.uid);

        if (!isUidExist) {
          userNotExist();
        } else {
          await setUserState(googleUserData.uid);
        }
      }
    } else {
      await setUserState(googleUserData.uid);
    }
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
