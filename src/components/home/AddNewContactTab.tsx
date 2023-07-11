import { useState } from "react";
import { UserData } from "../../common/types";
import {
  createConnectionRequest,
  getConnectedUsers,
  getUserData,
} from "../../services/database";
import { SearchIcon, SpinnerIcon, TickIcon } from "../../common/icons";
import { useAppSelector } from "../../hooks/hooks";
import ConnectionRequests from "./ConnectionRequests";

export default function AddNewContactTab() {
  const [username, setUsername] = useState<string>("");
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
    setUsername(searchUserInputValue);
  };

  const checkIsUserConnected = async () => {
    const connectedUsers = await getConnectedUsers(userUsername);
    if (!connectedUsers.includes(username)) {
      setIsUserConnected(false);
    } else {
      setIsUserConnected(true);
    }
  };

  const searchUser = async () => {
    setSearching(true);
    const userData = await getUserData(username);
    setSearchedUser(userData);
    await checkIsUserConnected();
    setSearching(false);
  };

  const sendConnectionRequest = async () => {
    setSendingConnectinRequest(true);
    await createConnectionRequest(userUsername, username);
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

  const getSearchedContact = () => {
    if (searchedUser) {
      return (
        <div className="searched-contact">
          <div className="searched-contact-user-info on-primary-container-text">
            <img src={searchedUser.photoUrl} />
            <div className="searched-contact-user-name">
              <div className="headline-small">{searchedUser.name}</div>
              <div className="label-medium">@{searchedUser.username}</div>
            </div>
          </div>
          {getSendConnectionRequestButton()}
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
    <div className="add-new-contact-tab">
      <div className="search-contact">
        <input
          className="body-large on-secondary-container-text secondary-container"
          type="text"
          placeholder="user@example.com"
          value={username}
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
