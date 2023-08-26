import { useEffect, useState } from "react";
import { AcceptConnectionRequestInput, UserData } from "../../common/types";
import {
  acceptConnectionRequest,
  getConnectionRequests,
} from "../../services/database";
import { useAppSelector } from "../../hooks/hooks";
import { SpinnerIcon, TickIcon } from "../../common/graphics";

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
        className="bg-secondary-light dark:bg-secondary-dark p-3 rounded-full"
        onClick={() => acceptSelectedConnectionRequest(requestId, username)}
      >
        {TickIcon("fill-on-secondary-light dark:fill-on-secondary-dark")}
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
      <div key={requestId} className="flex items-center">
        <div className="w-15 h-15 bg-on-background-loading-light dark:bg-on-background-loading-dark rounded-full overflow-hidden mr-2">
          <img className="w-full h-full object-cover" src={photoUrl} />
        </div>
        <div className="flex-1">
          <div className="text-title-medium">{name}</div>
          <div className="text-label-medium">@{username}</div>
        </div>
        {getSendConnectionRequestButton(requestId, username)}
      </div>
    );
  };

  const getConnectionRequestsList = () => {
    if (loadingConnectionRequests) {
      return SpinnerIcon;
    } else {
      return (
        <div className="mx-4 my-2 flex flex-col space-y-4">
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
    <div className="mt-4 overflow-auto">
      <div className="border-t-2 border-outline-variant-light dark:border-outline-variant-dark text-label-small pl-1">
        Incoming connection requests ({connectionRequestsCount})
      </div>
      {getConnectionRequestsList()}
    </div>
  );
}
