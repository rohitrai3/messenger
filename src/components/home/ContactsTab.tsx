import { useEffect, useState } from "react";
import { UserData } from "../../common/types";
import { getConnectedUsersData } from "../../services/database";
import { useAppSelector } from "../../hooks/hooks";
import { NextIcon, SpinnerIcon } from "../../common/icons";

export default function ContactsTab() {
  const [connectedUsersData, setConnectedUsersData] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const userUsername = useAppSelector((state) => state.user.username);

  const loadConnectedUsersData = async () => {
    setLoadingUsers(true);
    const usersData = await getConnectedUsersData(userUsername);
    setConnectedUsersData(usersData);
    setLoadingUsers(false);
  };

  const getConnectedUsersList = () => {
    if (loadingUsers) {
      return SpinnerIcon;
    } else {
      return (
        <div className="contacts-list">
          {connectedUsersData.map((connectedUserData) => {
            return (
              <div
                key={connectedUserData.username}
                className="contacts-user-info on-primary-container-text"
              >
                <img src={connectedUserData.photoUrl} />
                <div className="contacts-user-name">
                  <div className="headline-small">{connectedUserData.name}</div>
                  <div className="label-medium">
                    @{connectedUserData.username}
                  </div>
                </div>
                <div
                  className="secondary-action-icon secondary"
                  // onClick={() => acceptConnectionRequest(username)}
                >
                  {NextIcon}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  useEffect(() => {
    loadConnectedUsersData();
  }, []);

  return <div className="contacts-tab">{getConnectedUsersList()}</div>;
}
