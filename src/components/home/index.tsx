import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { getAuthenticatedGoogleUserData } from "../../services/authenticate";
import { getUser, getUsername } from "../../services/database";
import {
  setUserName,
  setUserPhotoUrl,
  setUserUid,
  setUserUsername,
} from "../../store/slices/userSlice";
import HomeHeader, { HomeHeaderProps } from "./HomeHeader";
import HomeFooter from "./HomeFooter";
import { GoogleUserData, UserData } from "../../common/types";
import { Theme } from "../../common/enums";
import { DarkModeButton, LightModeButton } from "../../common/buttons";
import { selectAppTheme } from "../../store/slices/appSlice";
import HomeContent, { HomeContentProps } from "./HomeContent";
import Chat, { ChatProps } from "../chat";

export default function Home() {
  const [initializingUserState, setInitializingUserState] =
    useState<boolean>(true);
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectAppTheme);
  const homeHeaderProps: HomeHeaderProps = {
    initializingUserState: initializingUserState,
  };
  const [selectedConnection, setSelectedConnection] = useState<UserData | null>(
    null
  );
  const chatProps: ChatProps = {
    connection: selectedConnection,
    setSelectedConnection: setSelectedConnection,
  };

  const initializeUserState = async () => {
    setInitializingUserState(true);
    const googleUserData: GoogleUserData = getAuthenticatedGoogleUserData();
    const username = await getUsername(googleUserData.uid);
    const userData = await getUser(username);
    dispatch(setUserUid(googleUserData.uid));
    dispatch(setUserUsername(username));
    dispatch(setUserName(userData.name));
    dispatch(setUserPhotoUrl(userData.photoUrl));
    sessionStorage.clear();
    setInitializingUserState(false);
  };

  const homeContentProps: HomeContentProps = {
    initializingUserState: initializingUserState,
    setSelectedConnection: setSelectedConnection,
  };

  const getThemeButton = () => {
    return theme === Theme.LIGHT ? <LightModeButton /> : <DarkModeButton />;
  };

  const showMainWindowWithChatOnLargeScreen = () => {
    if (selectedConnection) {
      return "hidden lg:flex";
    }
  };

  const hideEmptyChatWindow = () => {
    if (!selectedConnection) {
      return "hidden";
    }
  };

  useEffect(() => {
    initializeUserState();
  }, []);

  return (
    <div className="w-d-screen h-d-screen flex">
      <div
        className={`${showMainWindowWithChatOnLargeScreen()} w-full min-w-fit lg:w-fit h-full p-4 lg:pr-0 flex flex-col`}
      >
        {getThemeButton()}
        <HomeHeader {...homeHeaderProps} />
        <HomeContent {...homeContentProps} />
        <HomeFooter />
      </div>
      <div className={`${hideEmptyChatWindow()} flex-1 h-full lg:block`}>
        <Chat {...chatProps} />
      </div>
    </div>
  );
}
