import { MessengerLogo } from "../../common/icons";

export default function SignInHeader() {
  return (
    <div className="sign-in-header on-background-text">
      <div className="display-small">Welcome to</div>
      <div className="sign-in-messenger display-large">
        {MessengerLogo}
        Messenger
      </div>
    </div>
  );
}
