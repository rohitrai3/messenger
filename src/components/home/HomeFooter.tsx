import { signOutUser } from "../../services/authenticate";

export default function HomeFooter() {
  return (
    <div className="home-footer">
      <button
        className="sign-out-button label-large"
        onClick={() => signOutUser()}
      >
        Sign out
      </button>
      <a href="https://rohitrai.dev">
        <button className="portfolio-button label-large">Portfolio</button>
      </a>
    </div>
  );
}
