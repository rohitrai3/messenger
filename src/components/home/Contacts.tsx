import { useState } from "react";
import { ContactTab } from "../../common/enums";
import { TickIcon } from "../../common/graphics";
import AddNew from "./AddNew";
import MyContacts, { MyContactsProps } from "./MyContacts";

export type ContactsProps = {
  initializingUserState: boolean;
};

export default function Contacts({ initializingUserState }: ContactsProps) {
  const [selectedTab, setSelectedTab] = useState<ContactTab>(
    ContactTab.MY_CONTACTS
  );

  const getSelectionIcon = (tab: ContactTab) => {
    if (tab === selectedTab) {
      return TickIcon();
    }
  };

  const getSelectionColor = (tab: ContactTab) => {
    return tab === selectedTab
      ? "on-secondary-container-text secondary-container"
      : "on-surface-text surface";
  };

  const changeTab = (tab: ContactTab) => {
    switch (tab) {
      case ContactTab.MY_CONTACTS:
        setSelectedTab(ContactTab.MY_CONTACTS);
        break;
      case ContactTab.ADD_NEW:
        setSelectedTab(ContactTab.ADD_NEW);
        break;
    }
  };

  const myContactsProps: MyContactsProps = {
    initializingUserState: initializingUserState,
  };

  const getTabContent = () => {
    switch (selectedTab) {
      case ContactTab.MY_CONTACTS:
        return <MyContacts {...myContactsProps} />;
      case ContactTab.ADD_NEW:
        return <AddNew />;
    }
  };

  return (
    <div className="contacts">
      <div className="headline-small on-background-text">
        Who do you want to chat with?
      </div>
      <div className="contacts-tabs-panel primary-container">
        <div className="contacts-tabs">
          <div
            className={`my-contacts-title label-large ${getSelectionColor(
              ContactTab.MY_CONTACTS
            )}`}
            onClick={() => changeTab(ContactTab.MY_CONTACTS)}
          >
            {getSelectionIcon(ContactTab.MY_CONTACTS)}My contacts
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
        {getTabContent()}
      </div>
    </div>
  );
}
