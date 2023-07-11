import { useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import {
  UserState,
  setUserName,
  setUserPhotoUrl,
  setUserUid,
  setUserUsername,
} from "../../store/slices/userSlice";
import authenticate from "../../services/authentication";
import { createContact, createUser } from "../../services/database";
import { GoogleIcon } from "../../common/icons";

export type SignInFormProps = {
  setAuthenticating: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SignInForm({ setAuthenticating }: SignInFormProps) {
  const [username, setUsername] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const updateUsername = () => {
    const signInInputValue = (
      document.getElementById("signInInput") as HTMLInputElement
    ).value;
    setUsername(signInInputValue.trim());
  };

  const signIn = async () => {
    setAuthenticating(true);
    const user: UserState = await authenticate();
    await createUser(user.uid, username, user.name, user.photoUrl);
    await createContact(username);
    dispatch(setUserUid(user.uid));
    dispatch(setUserUsername(username));
    dispatch(setUserName(user.name));
    dispatch(setUserPhotoUrl(user.photoUrl));
    navigate("/home");
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

  console.log("username: ", username, " :end");

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
    </div>
  );
}
