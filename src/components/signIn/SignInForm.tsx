import { useState } from "react";
import { CloseIcon, TickIcon } from "../../common/graphics";
import {
  getAuthenticatedGoogleUserData,
  signIn,
  signOutUser,
} from "../../services/authenticate";
import { SignInTab } from "../../common/enums";
import {
  addUser,
  checkUidExist,
  checkUsernameExist,
} from "../../services/database";
import { AddUserInput, GoogleUserData } from "../../common/types";
import { useAppDispatch } from "../../hooks/hooks";
import { setUserIsAuthenticated } from "../../store/slices/userSlice";
import GoogleGLogo from "../../resources/google_ G _logo.svg";

export type SignInFormProps = {
  setAuthenticating: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SignInForm({ setAuthenticating }: SignInFormProps) {
  const [username, setUsername] = useState<string>("");
  const [notification, setNotification] = useState<string | null>(
    sessionStorage.getItem("error")
  );
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<SignInTab>(SignInTab.SIGN_IN);
  const activeTabStyle =
    "bg-inverse-surface-light dark:bg-inverse-surface-dark text-inverse-on-surface-light dark:text-inverse-on-surface-dark";
  const nonActiveTabStyle =
    "bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark";

  const updateUsername = () => {
    const signInInputValue = (
      document.getElementById("signInInput") as HTMLInputElement
    ).value;
    setUsername(signInInputValue.trim().toLowerCase());
  };

  const setErrorMessage = (message: string) => {
    sessionStorage.setItem("error", message);
    dispatch(setUserIsAuthenticated(false));
    signOutUser();
  };

  const signUpUser = async (
    isUidExist: boolean,
    googleUserData: GoogleUserData
  ) => {
    if (isUidExist) {
      setErrorMessage("User already exist. Please sign in as existing user.");
    } else {
      const isUsernameExist = await checkUsernameExist(username);
      if (isUsernameExist) {
        setErrorMessage(
          "Username already taken. Please try different username."
        );
      } else {
        const addUserInput: AddUserInput = {
          uid: googleUserData.uid,
          userData: {
            username: username,
            name: googleUserData.name,
            photoUrl: googleUserData.photoUrl,
          },
        };
        await addUser(addUserInput);
        dispatch(setUserIsAuthenticated(true));
        window.location.reload();
      }
    }
  };

  const signInUser = (isUidExist: boolean) => {
    if (isUidExist) {
      dispatch(setUserIsAuthenticated(true));
    } else {
      setErrorMessage("User does not exist. Please sign up as new user.");
    }
  };

  const authenticateUser = async () => {
    setAuthenticating(true);
    await signIn();
    const googleUserData: GoogleUserData = getAuthenticatedGoogleUserData();
    const isUidExist = await checkUidExist(googleUserData.uid);
    if (activeTab === SignInTab.SIGN_UP) {
      await signUpUser(isUidExist, googleUserData);
    } else {
      signInUser(isUidExist);
    }
    sessionStorage.setItem("username", username);
    setAuthenticating(false);
  };

  const disableButtonCondition = (activeTab === SignInTab.SIGN_UP &&
    (username.length === 0 || username.match(/\.|\#|\$|\[|\]|\//g))) as boolean;

  const getDisabledButtonStyle = () => {
    if (activeTab === SignInTab.SIGN_UP && disableButtonCondition) {
      return "opacity-50";
    }
  };

  const clearNotification = () => {
    setNotification("");
    sessionStorage.removeItem("error");
  };

  const getNotification = () => {
    if (notification) {
      return (
        <div className="notification body-medium error on-error-text">
          {notification}
          <div onClick={() => clearNotification()}>{CloseIcon}</div>
        </div>
      );
    }
  };

  const usernameInputField = (
    <input
      className="w-[297px] bg-primary-container-light dark:bg-primary-container-dark text-on-primary-container-light dark:text-on-primary-container-dark text-title-medium border-2 rounded-full border-outline-light dark:border-outline-dark px-6 py-3 mb-5"
      type="text"
      placeholder="Enter unique username..."
      value={username}
      id="signInInput"
      onChange={() => updateUsername()}
    />
  );

  const showUsernameInputField = () => {
    if (activeTab === SignInTab.SIGN_UP) {
      return usernameInputField;
    }
  };

  document.onkeydown = (event) => {
    if (event.key === "Enter") {
      (document.getElementById("signInButton") as HTMLButtonElement).click();
    }
  };

  const getButtonLabel = () => {
    return activeTab === SignInTab.SIGN_IN
      ? "Sign in with Google"
      : "Sign up with Google";
  };

  const getTickIcon = (tab: SignInTab) => {
    if (tab === activeTab) {
      return TickIcon(
        "fill-inverse-on-surface-light dark:fill-inverse-on-surface-dark mr-2 -ml-8"
      );
    }
  };

  const getTabStyle = (tab: SignInTab) => {
    return tab === activeTab ? activeTabStyle : nonActiveTabStyle;
  };

  return (
    <div className="flex flex-col items-center mb-5">
      <div className="w-[329px] flex mb-10">
        <div
          className={`${getTabStyle(
            SignInTab.SIGN_IN
          )} text-title-medium border-2 border-inverse-surface-light dark:border-inverse-surface-dark rounded-l-full flex-1 py-3 text-center flex justify-center border-r-0 hover:cursor-pointer`}
          onClick={() => setActiveTab(SignInTab.SIGN_IN)}
        >
          {getTickIcon(SignInTab.SIGN_IN)}
          Sign in
        </div>
        <div
          className={`${getTabStyle(
            SignInTab.SIGN_UP
          )} text-title-medium border-2 border-inverse-surface-light dark:border-inverse-surface-dark rounded-r-full flex-1 py-3 flex justify-center border-l-0 hover:cursor-pointer`}
          onClick={() => setActiveTab(SignInTab.SIGN_UP)}
        >
          {getTickIcon(SignInTab.SIGN_UP)}
          Sign up
        </div>
      </div>
      {showUsernameInputField()}
      <button
        className={`${getDisabledButtonStyle()} text-label-large bg-primary-light dark:bg-primary-dark text-on-primary-light dark:text-on-primary-dark px-6 py-3 rounded-full flex`}
        onClick={authenticateUser}
        disabled={disableButtonCondition}
        id="signInButton"
      >
        <img className="mr-2 h-5" src={GoogleGLogo} alt="Google G logo" />
        {getButtonLabel()}
      </button>
      {getNotification()}
    </div>
  );
}
