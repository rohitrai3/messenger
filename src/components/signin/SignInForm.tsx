import { useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import {
  UserState,
  setUserName,
  setUserPhotoUrl,
  setUserUid,
  setUserUsername,
} from "../../store/slices/userSlice";
import authenticate from "../../services/authentication";
import { createContact, createUser } from "../../services/database";
import { CloseIcon, GoogleIcon } from "../../common/icons";

export type SignInFormProps = {
  setAuthenticating: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SignInForm({ setAuthenticating }: SignInFormProps) {
  const [username, setUsername] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const notification = location.state?.notification;

  const updateUsername = () => {
    const signInInputValue = (
      document.getElementById("signInInput") as HTMLInputElement
    ).value;
    setUsername(signInInputValue.trim());
  };

  const signIn = async () => {
    setAuthenticating(true);
    const user: UserState = await authenticate();
    const notification = await createUser(
      user.uid,
      username,
      user.name,
      user.photoUrl
    );
    if (notification.length) {
      navigate("/", {
        state: {
          notification: notification,
        },
      });
    } else {
      await createContact(username);
      dispatch(setUserUid(user.uid));
      dispatch(setUserUsername(username));
      dispatch(setUserName(user.name));
      dispatch(setUserPhotoUrl(user.photoUrl));
      navigate("/home");
    }
    setAuthenticating(false);
  };

  const isDisableSignIn = () => {
    if (username.length === 0 || username.match(/\.|\#|\$|\[|\]|\//g)) {
      return true;
    } else {
      return false;
    }
  };

  const getDisabledButtonStyle = () => {
    if (isDisableSignIn()) {
      return "disabled-button";
    }
  };

  const getNotification = () => {
    if (notification) {
      return (
        <div className="notification body-medium error on-error-text">
          {notification}
          <div onClick={() => navigate("/")}>{CloseIcon}</div>
        </div>
      );
    }
  };

  return (
    <div className="sign-in-form">
      <input
        className="body-large on-primary-container-text primary-container"
        type="text"
        placeholder="Enter unique username"
        value={username}
        id="signInInput"
        onChange={() => updateUsername()}
      />
      <div className="sign-in-input-supporting text"></div>
      <button
        className={`${getDisabledButtonStyle()} primary label-large on-primary-text`}
        onClick={() => signIn()}
        disabled={isDisableSignIn()}
      >
        {GoogleIcon}
        Sign in with Google
      </button>
      {getNotification()}
    </div>
  );
}
