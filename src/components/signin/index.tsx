import { useState } from "react";
import { SpinnerIcon } from "../../common/icons";
import SignInForm, { SignInFormProps } from "./SignInForm";

export default function SignIn() {
  const [authenticating, setAuthenticating] = useState<boolean>(false);

  const signInFormProps: SignInFormProps = {
    setAuthenticating: setAuthenticating,
  };

  const getSignInForm = () => {
    return authenticating ? SpinnerIcon : <SignInForm {...signInFormProps} />;
  };

  return (
    <div className="sign-in background">
      <div className="sign-in-heading on-background-text">
        <div className="display-small">Welcome to</div>
        <div className="display-large">Messenger</div>
      </div>
      {getSignInForm()}
      <button className="portfolio-button label-large">Portfolio</button>
    </div>
  );
}
