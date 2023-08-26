import { useState } from "react";
import { ConnectionsTab } from "../../common/enums";
import { TickIcon } from "../../common/graphics";
import AddNew from "./AddNew";
import Connections, { ConnectionsProps } from "./Connections";

export type HomeContentProps = {
  initializingUserState: boolean;
};

export default function HomeContent({
  initializingUserState,
}: HomeContentProps) {
  const [activeTab, setActiveTab] = useState<ConnectionsTab>(
    ConnectionsTab.CONNECTIONS
  );
  const activeTabStyle =
    "bg-inverse-surface-light dark:bg-inverse-surface-dark text-inverse-on-surface-light dark:text-inverse-on-surface-dark";
  const nonActiveTabStyle =
    "bg-surface-light dark:bg-surface-dark text-on-surface-light dark:text-on-surface-dark";
  const connectionsProps: ConnectionsProps = {
    initializingUserState: initializingUserState,
  };

  const getTabStyle = (tab: ConnectionsTab) => {
    return tab === activeTab ? activeTabStyle : nonActiveTabStyle;
  };

  const getTickIcon = (tab: ConnectionsTab) => {
    if (tab === activeTab) {
      return TickIcon(
        "w-4 h-4 fill-inverse-on-surface-light dark:fill-inverse-on-surface-dark mr-1 -ml-6"
      );
    }
  };

  const getTabContent = () => {
    return activeTab === ConnectionsTab.CONNECTIONS ? (
      <Connections {...connectionsProps} />
    ) : (
      <AddNew />
    );
  };

  return (
    <div className="flex flex-col items-center flex-1 overflow-auto">
      <div className="w-[361px] flex mb-4">
        <div
          className={`${getTabStyle(
            ConnectionsTab.CONNECTIONS
          )} text-title-small border-2 border-inverse-surface-light dark:border-inverse-surface-dark rounded-l-full flex-1 py-3 text-center flex justify-center border-r-0 hover:cursor-pointer`}
          onClick={() => setActiveTab(ConnectionsTab.CONNECTIONS)}
        >
          {getTickIcon(ConnectionsTab.CONNECTIONS)}
          Connections
        </div>
        <div
          className={`${getTabStyle(
            ConnectionsTab.ADD_CONNECTIONS
          )} text-title-small border-2 border-inverse-surface-light dark:border-inverse-surface-dark rounded-r-full flex-1 py-3 flex justify-center border-l-0 hover:cursor-pointer`}
          onClick={() => setActiveTab(ConnectionsTab.ADD_CONNECTIONS)}
        >
          {getTickIcon(ConnectionsTab.ADD_CONNECTIONS)}
          Add connections
        </div>
      </div>
      {getTabContent()}
    </div>
  );
}
