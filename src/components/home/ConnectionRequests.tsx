import { useEffect, useState } from "react";
import { UserData } from "../../common/types";
import { getConnectionRequests, updateContact } from "../../services/database";
import { useAppSelector } from "../../hooks/hooks";
import { SpinnerIcon, TickIcon } from "../../common/icons";

export default function ConnectionRequests() {
  const [connectionRequests, setConnectionRequests] = useState<UserData[]>([]);
  const [loadingConnectionRequests, setLoadingConnectionRequests] =
    useState<boolean>(false);
  const userUsername = useAppSelector((state) => state.user.username);
  const [acceptingConnectionRequest, setAcceptingConnectionRequest] =
    useState<boolean>(false);

  const loadConnectionRequests = async () => {
    setLoadingConnectionRequests(true);
    const usersData = await getConnectionRequests(userUsername);
    setConnectionRequests(usersData);
    setLoadingConnectionRequests(false);
  };

  const acceptConnectionRequest = async (username: string) => {
    setAcceptingConnectionRequest(true);
    await updateContact(userUsername, username);
    await loadConnectionRequests();
    setAcceptingConnectionRequest(false);
  };

  const acceptConnectionRequestButton = (username: string) => {
    return (
      <div
        className="secondary-action-icon secondary"
        onClick={() => acceptConnectionRequest(username)}
      >
        {TickIcon}
      </div>
    );
  };

  const getSendConnectionRequestButton = (username: string) => {
    return acceptingConnectionRequest
      ? SpinnerIcon
      : acceptConnectionRequestButton(username);
  };

  const getConnectionRequestsList = () => {
    if (loadingConnectionRequests) {
      return SpinnerIcon;
    } else {
      return (
        <div className="connection-requests-list">
          {connectionRequests.map((connectionRequest) => {
            return (
              <div
                key={connectionRequest.username}
                className="connection-requests-user-info on-primary-container-text"
              >
                <img src={connectionRequest.photoUrl} />
                <div className="connection-requests-user-name">
                  <div className="headline-small">{connectionRequest.name}</div>
                  <div className="label-medium">
                    @{connectionRequest.username}
                  </div>
                </div>
                {getSendConnectionRequestButton(connectionRequest.username)}
              </div>
            );
          })}
        </div>
      );
    }
  };

  useEffect(() => {
    loadConnectionRequests();
  }, []);

  return (
    <div className="connection-requests">
      <div className="connection-requests-heading title-small on-surface-variant-text">
        Incoming connection requests ({connectionRequests.length})
      </div>
      {getConnectionRequestsList()}
    </div>
  );
}
