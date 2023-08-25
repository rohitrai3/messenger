import { useEffect, useState } from "react";
import { UserData } from "../../common/types";
import { getConnections } from "../../services/database";
import { useAppSelector } from "../../hooks/hooks";
import { NextIcon, SpinnerIcon } from "../../common/graphics";
import { useNavigate } from "react-router-dom";

export type MyContactsProps = {
  initializingUserState: boolean;
};

export default function MyContacts({ initializingUserState }: MyContactsProps) {
  const [connectedUsersData, setConnectedUsersData] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const userUsername = useAppSelector((state) => state.user.username);
  const navigate = useNavigate();

  const loadConnectedUsersData = async () => {
    setLoadingUsers(true);
    const userDataList = await getConnections(userUsername);
    setConnectedUsersData(userDataList);
    setLoadingUsers(false);
  };

  const showContactUserInfo = (
    username: string,
    name: string,
    photoUrl: string
  ) => {
    return (
      <div key={username} className="contact-list-item">
        <div
          key={username}
          className="contact-user-info on-primary-container-text"
        >
          <img src={photoUrl} />
          <div className="contact-user-name">
            <div className="headline-small">{name}</div>
            <div className="label-medium">@{username}</div>
          </div>
          <div
            className="secondary-action-icon secondary"
            onClick={() =>
              navigate("/chat", {
                state: {
                  username: username,
                  init: initializingUserState,
                },
              })
            }
          >
            {NextIcon}
          </div>
        </div>
      </div>
    );
  };

  const getConnectedUsersList = () => {
    if (loadingUsers) {
      return SpinnerIcon;
    } else {
      return (
        <div className="my-contacts">
          {connectedUsersData.map((connectedUserData) => {
            return showContactUserInfo(
              connectedUserData.username,
              connectedUserData.name,
              connectedUserData.photoUrl
            );
          })}
        </div>
      );
    }
  };

  useEffect(() => {
    if (!initializingUserState) {
      loadConnectedUsersData();
    }
  }, [initializingUserState]);

  return getConnectedUsersList();
}
