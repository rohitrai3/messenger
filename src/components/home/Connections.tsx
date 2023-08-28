import { useEffect, useState } from "react";
import { UserData } from "../../common/types";
import { getConnections } from "../../services/database";
import { useAppSelector } from "../../hooks/hooks";
import { SpinnerIcon } from "../../common/graphics";

export type ConnectionsProps = {
  initializingUserState: boolean;
  setSelectedConnection: React.Dispatch<React.SetStateAction<UserData | null>>;
};

export default function Connections({
  initializingUserState,
  setSelectedConnection,
}: ConnectionsProps) {
  const [connectedUsersData, setConnectedUsersData] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const userUsername = useAppSelector((state) => state.user.username);

  const loadConnectedUsersData = async () => {
    setLoadingUsers(true);
    const userDataList = await getConnections(userUsername);
    setConnectedUsersData(userDataList);
    setLoadingUsers(false);
  };

  const showContactUserInfo = (user: UserData) => {
    return (
      <div
        key={user.username}
        className="w-fit flex items-center hover:cursor-pointer"
        onClick={() => {
          setSelectedConnection(user);
        }}
      >
        <div className="w-15 h-15 rounded-full overflow-hidden bg-on-background-loading-light dark:bg-on-background-loading-dark mr-2">
          <img className="w-full h-full object-cover" src={user.photoUrl} />
        </div>
        <div>
          <div className="text-title-medium">{user.name}</div>
          <div className="text-label-medium">@{user.username}</div>
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
            return showContactUserInfo(connectedUserData);
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
