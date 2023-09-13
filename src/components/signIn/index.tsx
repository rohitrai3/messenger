import { useState } from "react";
import { SpinnerIcon } from "../../common/graphics";
import SignInForm, { SignInFormProps } from "./SignInForm";
import SignInHeader from "./SignInHeader";
import SignInFooter from "./SignInFooter";
import { DarkModeButton, LightModeButton } from "../../common/buttons";
import { Theme } from "../../common/enums";
import { useAppSelector } from "../../hooks/hooks";
import { selectAppTheme } from "../../store/slices/appSlice";

export default function SignIn() {
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const theme = useAppSelector(selectAppTheme);

  const signInFormProps: SignInFormProps = {
    setAuthenticating: setAuthenticating,
  };

  const getSignInForm = () => {
    return authenticating ? SpinnerIcon : <SignInForm {...signInFormProps} />;
  };

  const getThemeButton = () => {
    return theme === Theme.LIGHT ? <LightModeButton /> : <DarkModeButton />;
  };

  return (
    <div className="w-d-screen h-d-screen flex flex-col items-center p-4">
      <div className="flex-1 flex flex-col justify-center items-center">
        {getThemeButton()}
        <SignInHeader />
        {getSignInForm()}
      </div>
      <SignInFooter />
    </div>
  );
}
