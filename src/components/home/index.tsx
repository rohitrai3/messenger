import { ReactElement, useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/hooks";
import { ContactTab } from "../../common/enums";
import { useNavigate } from "react-router-dom";
import AddNewContactTab from "./AddNewContactTab";
import { TickIcon } from "../../common/icons";

export default function Home() {
  const userName = useAppSelector((state) => state.user.name);
  const userPhotoUrl = useAppSelector((state) => state.user.photoUrl);
  const userUsername = useAppSelector((state) => state.user.username);
  const [selectedTab, setSelectedTab] = useState<ContactTab>(
    ContactTab.CONTACTS
  );
  const navigate = useNavigate();

  const contactsTabContent = <h1>Contacts</h1>;

  const [selectedTabContent, setSelectedTabContent] =
    useState<ReactElement>(contactsTabContent);

  const getSelectionIcon = (tab: ContactTab) => {
    if (tab === selectedTab) {
      return TickIcon;
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
    setSelectedTabContent(getTabContent(tab));
  };

  const getTabContent = (tab: ContactTab) => {
    switch (tab) {
      case ContactTab.CONTACTS:
        return contactsTabContent;
      case ContactTab.ADD_NEW:
        return <AddNewContactTab />;
    }
  };

  useEffect(() => {
    if (userName === "Unknown") navigate("/");
  });

  return (
    <div className="home background">
      <div className="display-small on-background-text">Hello!</div>
      <img className="profile-photo" src={userPhotoUrl} />
      <div className="display-medium on-background-text">{userName}</div>
      <div className="label-large on-background-text">@{userUsername}</div>
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
        <div className="contacts-content">{selectedTabContent}</div>
      </div>
    </div>
  );
}
