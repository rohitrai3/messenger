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
    setUsername(signInInputValue);
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
      <button
        className="primary label-large on-primary-text"
        onClick={() => signIn()}
      >
        {GoogleIcon}
        Sign in with Google
      </button>
    </div>
  );
}
