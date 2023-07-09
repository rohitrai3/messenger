import google from "../assets/google.svg";

export default function SignIn() {
  return (
    <div className="sign-in background">
      <div className="sign-in-greeting display-small on-background-text">
        Welcome to
      </div>
      <div className="sign-in-messenger display-large on-background-text">
        Messenger
      </div>
      <button className="sign-in-button primary label-large on-primary-text">
        <img src={google} />
        Sign in with Google
      </button>
      <button className="portfolio-button label-large">Portfolio</button>
    </div>
  );
}
