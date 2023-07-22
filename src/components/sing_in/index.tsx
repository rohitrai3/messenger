import { useEffect, useState } from "react";
import { SpinnerIcon } from "../../common/icons";
import SignInForm, { SignInFormProps } from "./SignInForm";
import SignInHeader from "./SignInHeader";
import SignInFooter from "./SignInFooter";
import { incrementVisitorCounter } from "../../services/analytics/database";

export default function SignIn() {
  const [authenticating, setAuthenticating] = useState<boolean>(false);

  const signInFormProps: SignInFormProps = {
    setAuthenticating: setAuthenticating,
  };

  const getSignInForm = () => {
    return authenticating ? SpinnerIcon : <SignInForm {...signInFormProps} />;
  };

  const setVisitorCount = async () => {
    if (!(localStorage.getItem("isMessengerVisited") === "true")) {
      await incrementVisitorCounter("messenger");
      localStorage.setItem("isMessengerVisited", "true");
    }
  };

  useEffect(() => {
    setVisitorCount();
  }, []);

  return (
    <div className="sign-in background">
      <SignInHeader />
      {getSignInForm()}
      <SignInFooter />
    </div>
  );
}
