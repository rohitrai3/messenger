import { useState } from "react";
import { CloseIcon, GoogleIcon } from "../../common/icons";
import {
  getAuthenticatedGoogleUserData,
  signIn,
  signOutUser,
} from "../../services/authenticate";
import { UserType } from "../../common/enums";
import {
  addUser,
  checkUidExist,
  checkUsernameExist,
} from "../../services/database";
import { AddUserInput, GoogleUserData } from "../../common/types";
import { useAppDispatch } from "../../hooks/hooks";
import { setUserIsAuthenticated } from "../../store/slices/userSlice";

export type SignInFormProps = {
  setAuthenticating: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SignInForm({ setAuthenticating }: SignInFormProps) {
  const [username, setUsername] = useState<string>("");
  const [notification, setNotification] = useState<string | null>(
    sessionStorage.getItem("error")
  );
  const [userType, setUserType] = useState<UserType>(UserType.EXISTING);
  const dispatch = useAppDispatch();

  const updateUsername = () => {
    const signInInputValue = (
      document.getElementById("signInInput") as HTMLInputElement
    ).value;
    setUsername(signInInputValue.trim().toLowerCase());
  };

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
      "User does not exist. Please sign up as new user."
    );
    signOutUser();
  };

  const signUpUser = async (
    isUidExist: boolean,
    googleUserData: GoogleUserData
  ) => {
    if (isUidExist) {
      userAlreadyExist();
    } else {
      const isUsernameExist = await checkUsernameExist(username);
      if (isUsernameExist) {
        usernameAlreadyTaken();
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
      }
    }
  };

  const signInUser = (isUidExist: boolean) => {
    if (isUidExist) {
      dispatch(setUserIsAuthenticated(true));
    } else {
      userNotExist();
    }
  };

  const authenticateUser = async () => {
    setAuthenticating(true);
    await signIn();
    const googleUserData: GoogleUserData = getAuthenticatedGoogleUserData();
    const isUidExist = await checkUidExist(googleUserData.uid);
    if (userType === UserType.NEW) {
      await signUpUser(isUidExist, googleUserData);
    } else {
      signInUser(isUidExist);
    }
    sessionStorage.setItem("username", username);
    setAuthenticating(false);
  };

  const disableButtonCondition = (userType === UserType.NEW &&
    (username.length === 0 || username.match(/\.|\#|\$|\[|\]|\//g))) as boolean;

  const getDisabledButtonStyle = () => {
    if (userType === UserType.NEW && disableButtonCondition) {
      return "disabled-button";
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

  const toggleSelectUserTypeSwitch = () => {
    if (userType === UserType.NEW) {
      setUserType(UserType.EXISTING);
    } else {
      setUserType(UserType.NEW);
    }
  };

  const newUserSwitch = (
    <div
      className="select-user-type-switch"
      onClick={() => toggleSelectUserTypeSwitch()}
    >
      <div className="switch-track-new-user surface-container-highest">
        <div className="switch-handle-new-user outline"></div>
      </div>
    </div>
  );

  const existingUserSwitch = (
    <div
      className="select-user-type-switch"
      onClick={() => toggleSelectUserTypeSwitch()}
    >
      <div className="switch-track-existing-user primary">
        <div className="switch-handle-existing-user on-primary"></div>
      </div>
    </div>
  );

  const getSelectUserTypeSwitch = () => {
    if (userType === UserType.NEW) {
      return newUserSwitch;
    } else {
      return existingUserSwitch;
    }
  };

  const showUsernameInputField = () => {
    if (userType === UserType.NEW) {
      return (
        <input
          className="body-large on-primary-container-text primary-container"
          type="text"
          placeholder="Enter unique username"
          value={username}
          id="signInInput"
          onChange={() => updateUsername()}
        />
      );
    }
  };

  document.onkeydown = (event) => {
    if (event.key === "Enter") {
      (document.getElementById("signInButton") as HTMLButtonElement).click();
    }
  };

  const getButtonLabel = () => {
    return userType === UserType.NEW
      ? "Sign up with Google"
      : "Sign in with Google";
  };

  return (
    <div className="sign-in-form">
      <div className="select-user-type label-large on-background-text">
        <div
          className="select-user-type-label"
          onClick={() => setUserType(UserType.NEW)}
        >
          New user
        </div>
        {getSelectUserTypeSwitch()}
        <div
          className="select-user-type-label"
          onClick={() => setUserType(UserType.EXISTING)}
        >
          Existing user
        </div>
      </div>
      {showUsernameInputField()}
      <button
        className={`${getDisabledButtonStyle()} primary label-large on-primary-text`}
        onClick={() => authenticateUser()}
        disabled={disableButtonCondition}
        id="signInButton"
      >
        {GoogleIcon}
        {getButtonLabel()}
      </button>
      {getNotification()}
    </div>
  );
}
