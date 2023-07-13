import { useEffect, useState } from "react";
import { UserData } from "../../common/types";
import {
  getConnectionRequestsOnUpdate,
  addContact,
  removeConnectionRequest,
} from "../../services/database";
import { useAppSelector } from "../../hooks/hooks";
import { SpinnerIcon, TickIcon } from "../../common/icons";

export default function ConnectionRequests() {
  const [connectionRequests, setConnectionRequests] = useState<UserData[]>([]);
  const [loadingConnectionRequests, setLoadingConnectionRequests] =
    useState<boolean>(false);
  const userUsername = useAppSelector((state) => state.user.username);
  const [acceptingConnectionRequest, setAcceptingConnectionRequest] =
    useState<boolean>(false);
  const [connectionRequestsCount, setConnectionRequestsCount] =
    useState<number>(0);

  const loadConnectionRequests = async () => {
    setLoadingConnectionRequests(true);
    await getConnectionRequestsOnUpdate(userUsername, setConnectionRequests);
    setLoadingConnectionRequests(false);
  };

  const acceptConnectionRequest = async (username: string) => {
    setAcceptingConnectionRequest(true);
    await addContact(userUsername, username);
    await addContact(username, userUsername);
    await removeConnectionRequest(userUsername, username);
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
          {getSendConnectionRequestButton(username)}
        </div>
      </div>
    );
  };

  const getConnectionRequestsList = () => {
    if (loadingConnectionRequests) {
      return SpinnerIcon;
    } else {
      return (
        <div className="connection-request-list">
          {connectionRequests?.map((connectionRequest) => {
            return showContactUserInfo(
              connectionRequest.username,
              connectionRequest.name,
              connectionRequest.photoUrl
            );
          })}
        </div>
      );
    }
  };

  const updateConnectionRequestsCount = () => {
    if (connectionRequests) {
      setConnectionRequestsCount(connectionRequests.length);
    } else {
      setConnectionRequestsCount(0);
    }
  };

  useEffect(() => {
    loadConnectionRequests();
  }, []);

  useEffect(() => {
    updateConnectionRequestsCount();
  }, [connectionRequests]);

  return (
    <div className="connection-requests">
      <div className="connection-requests-heading title-small on-surface-variant-text">
        Incoming connection requests ({connectionRequestsCount})
      </div>
      {getConnectionRequestsList()}
    </div>
  );
}
