import { useState } from "react";
import { SpinnerIcon } from "../../common/icons";
import SignInForm, { SignInFormProps } from "./SignInForm";
import SignInHeader from "./SignInHeader";
import SignInFooter from "./SignInFooter";

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
      <SignInHeader />
      {getSignInForm()}
      <SignInFooter />
    </div>
  );
}
