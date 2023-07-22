import { useState } from "react";
import { CloseIcon, GoogleIcon } from "../../common/icons";
import { signIn } from "../../services/authenticate";
import { UserType } from "../../common/enums";

export type SignInFormProps = {
  setAuthenticating: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SignInForm({ setAuthenticating }: SignInFormProps) {
  const [username, setUsername] = useState<string>("");
  const [notification, setNotification] = useState<string | null>(
    sessionStorage.getItem("error")
  );
  const [userType, setUserType] = useState<UserType>(UserType.EXISTING);

  const updateUsername = () => {
    const signInInputValue = (
      document.getElementById("signInInput") as HTMLInputElement
    ).value;
    setUsername(signInInputValue.trim().toLowerCase());
  };

  const signInUser = async () => {
    setAuthenticating(true);
    sessionStorage.setItem("userType", userType.toString());
    sessionStorage.setItem("username", username);
    await signIn();
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

  return (
    <div className="sign-in-form">
      <div className="select-user-type label-large on-background-text">
        New user
        {getSelectUserTypeSwitch()} Existing user
      </div>
      {showUsernameInputField()}
      <button
        className={`${getDisabledButtonStyle()} primary label-large on-primary-text`}
        onClick={() => signInUser()}
        disabled={disableButtonCondition}
        id="signInButton"
      >
        {GoogleIcon}
        Sign in with Google
      </button>
      {getNotification()}
    </div>
  );
}
