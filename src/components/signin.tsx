import authenticate from "../services/authentication";
import google from "../assets/google.svg";
import { useState } from "react";

export default function SignIn() {
  const [authenticating, setAuthenticating] = useState<boolean>(false);

  const getSignInButton = () => {
    return authenticating ? (
      <svg
        className="spinner"
        xmlns="http://www.w3.org/2000/svg"
        height="48"
        viewBox="0 -960 960 960"
        width="48"
      >
        <path d="M480-80q-84 0-157-31t-127-85q-54-54-85-127T80-480q0-84 31-157t85-127q54-54 127-85t157-31q12 0 21 9t9 21q0 12-9 21t-21 9q-141 0-240.5 99.5T140-480q0 141 99.5 240.5T480-140q141 0 240.5-99.5T820-480q0-12 9-21t21-9q12 0 21 9t9 21q0 84-31 157t-85 127q-54 54-127 85T480-80Z" />
      </svg>
    ) : (
      <button
        className="sign-in-button primary label-large on-primary-text"
        onClick={() => signIn()}
      >
        <img className="sign-in-icon" src={google} />
        Sign in with Google
      </button>
    );
  };

  const signIn = async () => {
    setAuthenticating(true);
    await authenticate();
    setAuthenticating(false);
  };

  return (
    <div className="sign-in background">
      <div className="display-small on-background-text">Welcome to</div>
      <div className="display-large on-background-text">Messenger</div>
      {getSignInButton()}
      <button className="portfolio-button label-large">Portfolio</button>
    </div>
  );
}
