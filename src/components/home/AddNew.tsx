import { useState } from "react";
import { UserData } from "../../common/types";
import {
  addConnectionRequest,
  getConnectedUsers,
  getUserData,
} from "../../services/database";
import { SearchIcon, SpinnerIcon, TickIcon } from "../../common/icons";
import { useAppSelector } from "../../hooks/hooks";
import ConnectionRequests from "./ConnectionRequests";

export default function AddNew() {
  const [searchUsername, setSearchUsername] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [searchedUser, setSearchedUser] = useState<UserData>();
  const [sendingConnectionRequest, setSendingConnectinRequest] =
    useState<boolean>(false);
  const userUsername = useAppSelector((state) => state.user.username);
  const [isUserConnected, setIsUserConnected] = useState<boolean>(true);

  const updateUsername = () => {
    const searchUserInputValue = (
      document.getElementById("searchUserInput") as HTMLInputElement
    ).value;
    setSearchUsername(searchUserInputValue.trim().toLowerCase());
  };

  const checkIsUserConnected = async () => {
    const connectedUsers = await getConnectedUsers(userUsername);
    if (!connectedUsers.includes(searchUsername)) {
      setIsUserConnected(false);
    } else {
      setIsUserConnected(true);
    }
  };

  const searchUser = async () => {
    setSearching(true);
    const userData = await getUserData(searchUsername);
    setSearchedUser(userData);
    await checkIsUserConnected();
    setSearchUsername("");
    setSearching(false);
  };

  const sendConnectionRequest = async () => {
    setSendingConnectinRequest(true);
    await addConnectionRequest(userUsername, searchedUser?.username!);
    setIsUserConnected(true);
    setSendingConnectinRequest(false);
  };

  const sendConnectionRequestButton = () => {
    return (
      <div
        className="secondary-action-icon secondary"
        onClick={() => sendConnectionRequest()}
      >
        {TickIcon}
      </div>
    );
  };

  const getSendConnectionRequestButton = () => {
    if (!isUserConnected) {
      return sendingConnectionRequest
        ? SpinnerIcon
        : sendConnectionRequestButton();
    }
  };

  const showContactUserInfo = (
    username: string,
    name: string,
    photoUrl: string
  ) => {
    return (
      <div
        key={username}
        className="contact-user-info on-primary-container-text"
      >
        <img src={photoUrl} />
        <div className="contact-user-name">
          <div className="headline-small">{name}</div>
          <div className="label-medium">@{username}</div>
        </div>
        {getSendConnectionRequestButton()}
      </div>
    );
  };

  const getSearchedContact = () => {
    if (searchedUser) {
      return (
        <div className="searched-contact">
          {showContactUserInfo(
            searchedUser.username,
            searchedUser.name,
            searchedUser.photoUrl
          )}
        </div>
      );
    }
  };

  const searchButton = () => {
    return (
      <div className="primary-action-icon primary" onClick={() => searchUser()}>
        {SearchIcon}
      </div>
    );
  };

  const getSearchButton = () => {
    return searching ? SpinnerIcon : searchButton();
  };

  return (
    <div className="add-new">
      <div className="search-contact">
        <input
          className="body-large on-secondary-container-text secondary-container"
          type="text"
          placeholder="Enter username"
          value={searchUsername}
          onChange={() => updateUsername()}
          id="searchUserInput"
        />
        {getSearchButton()}
      </div>
      {getSearchedContact()}
      <ConnectionRequests />
    </div>
  );
}
