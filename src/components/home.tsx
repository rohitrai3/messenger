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
      <div className="contacts-panel primary-container">
        <div className="contacts-tabs">
          <div className="contacts-title label-large on-secondary-container-text secondary-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
            Contacts
          </div>
          <div className="add-new-title label-large on-surface-text surface">
            Add new
          </div>
        </div>
      </div>
    </div>
  );
}
