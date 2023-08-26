import { useEffect, useState } from "react";
import { UserData } from "../../common/types";
import { getConnections } from "../../services/database";
import { useAppSelector } from "../../hooks/hooks";
import { SpinnerIcon } from "../../common/graphics";
import { useNavigate } from "react-router-dom";

export type ConnectionsProps = {
  initializingUserState: boolean;
};

export default function Connections({
  initializingUserState,
}: ConnectionsProps) {
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
      <div
        key={username}
        className="w-fit flex items-center hover:cursor-pointer"
        onClick={() =>
          navigate("/chat", {
            state: {
              username: username,
              init: initializingUserState,
            },
          })
        }
      >
        <div className="w-15 h-15 rounded-full overflow-hidden bg-on-background-loading-light dark:bg-on-background-loading-dark mr-2">
          <img className="w-full h-full object-cover" src={photoUrl} />
        </div>
        <div>
          <div className="text-title-medium">{name}</div>
          <div className="text-label-medium">@{username}</div>
        </div>
      </div>
    );
  };

  const getConnectedUsersList = () => {
    if (loadingUsers) {
      return SpinnerIcon;
    } else {
      return (
        <div className="w-[345px] grid grid-cols-2 gap-y-4 overflow-auto">
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
