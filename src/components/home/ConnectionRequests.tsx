import { useEffect, useState } from "react";
import { AcceptConnectionRequestInput, UserData } from "../../common/types";
import {
  acceptConnectionRequest,
  getConnectionRequests,
} from "../../services/database";
import { useAppSelector } from "../../hooks/hooks";
import { SpinnerIcon, TickIcon } from "../../common/icons";

export default function ConnectionRequests() {
  const [connectionRequests, setConnectionRequests] = useState<
    Map<string, UserData>
  >(new Map());
  const [loadingConnectionRequests, setLoadingConnectionRequests] =
    useState<boolean>(true);
  const userUsername = useAppSelector((state) => state.user.username);
  const [acceptingConnectionRequest, setAcceptingConnectionRequest] =
    useState<boolean>(false);
  const [connectionRequestsCount, setConnectionRequestsCount] =
    useState<number>(0);

  const loadConnectionRequests = async () => {
    setLoadingConnectionRequests(true);
    const requestIdToUserData = await getConnectionRequests(userUsername);
    setConnectionRequests(requestIdToUserData);
    setLoadingConnectionRequests(false);
  };

  const acceptSelectedConnectionRequest = async (
    requestId: string,
    username: string
  ) => {
    setAcceptingConnectionRequest(true);
    const acceptConnectionRequestInput: AcceptConnectionRequestInput = {
      user: userUsername,
      connection: username,
      connectionRequestKey: requestId,
    };
    console.log("requestId: ", requestId);
    await acceptConnectionRequest(acceptConnectionRequestInput);
    await loadConnectionRequests();
    setAcceptingConnectionRequest(false);
  };

  const acceptConnectionRequestButton = (
    requestId: string,
    username: string
  ) => {
    return (
      <div
        className="secondary-action-icon secondary"
        onClick={() => acceptSelectedConnectionRequest(requestId, username)}
      >
        {TickIcon}
      </div>
    );
  };

  const getSendConnectionRequestButton = (
    requestId: string,
    username: string
  ) => {
    return acceptingConnectionRequest
      ? SpinnerIcon
      : acceptConnectionRequestButton(requestId, username);
  };

  const showContactUserInfo = (
    requestId: string,
    username: string,
    name: string,
    photoUrl: string
  ) => {
    return (
      <div key={requestId} className="contact-list-item">
        <div
          key={requestId}
          className="contact-user-info on-primary-container-text"
        >
          <img src={photoUrl} />
          <div className="contact-user-name">
            <div className="headline-small">{name}</div>
            <div className="label-medium">@{username}</div>
          </div>
          {getSendConnectionRequestButton(requestId, username)}
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
          {Array.from(connectionRequests).map(([requestId, userData]) =>
            showContactUserInfo(
              requestId,
              userData.username,
              userData.name,
              userData.photoUrl
            )
          )}
        </div>
      );
    }
  };

  const updateConnectionRequestsCount = () => {
    if (connectionRequests) {
      setConnectionRequestsCount(connectionRequests.size);
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
