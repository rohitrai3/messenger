import { useAppSelector } from "../hooks/hooks";

export default function Home() {
  const userName = useAppSelector((state) => state.user.name);

  return (
    <div className="home background">
      <div className="display-large on-background-text">Hello!</div>
      <img
        className="profile-photo"
        src="https://raw.githubusercontent.com/rohitrai3/resources/main/images/profile.jpg"
      />
      <div className="display-medium on-background-text">{userName}</div>
      <div className="horizontal-line outline-variant" />
      <div className="headline-small on-background-text">
        Who do you want to chat with?
      </div>
    </div>
  );
}
