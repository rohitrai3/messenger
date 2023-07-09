import { useState } from "react";
import { useAppSelector } from "../hooks/hooks";
import { ContactTab } from "../enums/enums";

export default function Home() {
  const userName = useAppSelector((state) => state.user.name);
  const [selectedTab, setSelectedTab] = useState<ContactTab>(
    ContactTab.CONTACTS
  );

  const getSelectionIcon = (tab: ContactTab) => {
    if (tab === selectedTab) {
      return (
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
      );
    }
  };

  const getSelectionColor = (tab: ContactTab) => {
    return tab === selectedTab
      ? "on-secondary-container-text secondary-container"
      : "on-surface-text surface";
  };

  const changeTab = (tab: ContactTab) => {
    switch (tab) {
      case ContactTab.CONTACTS:
        setSelectedTab(ContactTab.CONTACTS);
        break;
      case ContactTab.ADD_NEW:
        setSelectedTab(ContactTab.ADD_NEW);
        break;
    }
  };

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
          <div
            className={`contacts-title label-large ${getSelectionColor(
              ContactTab.CONTACTS
            )}`}
            onClick={() => changeTab(ContactTab.CONTACTS)}
          >
            {getSelectionIcon(ContactTab.CONTACTS)}Contacts
          </div>
          <div
            className={`add-new-title label-large ${getSelectionColor(
              ContactTab.ADD_NEW
            )}`}
            onClick={() => changeTab(ContactTab.ADD_NEW)}
          >
            {getSelectionIcon(ContactTab.ADD_NEW)}Add new
          </div>
        </div>
      </div>
    </div>
  );
}
