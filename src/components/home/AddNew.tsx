import { useState } from "react";
import { AddConnectionRequestInput, UserData } from "../../common/types";
import {
  addConnectionRequest,
  getConnections,
  getUser,
} from "../../services/database";
import { SearchIcon, SpinnerIcon, TickIcon } from "../../common/graphics";
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
    const connectedUsers = await getConnections(userUsername);
    const usernames = connectedUsers.map((user) => user.username);
    if (!usernames.includes(searchUsername)) {
      setIsUserConnected(false);
    } else {
      setIsUserConnected(true);
    }
  };

  const searchUser = async () => {
    setSearching(true);
    const userData = await getUser(searchUsername);
    setSearchedUser(userData);
    await checkIsUserConnected();
    setSearchUsername("");
    setSearching(false);
  };

  const sendConnectionRequest = async () => {
    setSendingConnectinRequest(true);
    const addConnectionRequestInput: AddConnectionRequestInput = {
      sender: userUsername,
      receiver: searchedUser?.username!,
    };
    await addConnectionRequest(addConnectionRequestInput);
    setIsUserConnected(true);
    setSendingConnectinRequest(false);
  };

  const sendConnectionRequestButton = () => {
    return (
      <div
        className="bg-secondary-light dark:bg-secondary-dark rounded-full p-3 cursor-pointer"
        onClick={() => sendConnectionRequest()}
      >
        {TickIcon("fill-on-secondary-light dark:fill-on-secondary-dark")}
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
      <div key={username} className="flex items-center px-4 mt-2">
        <div className="w-15 h-15 rounded-full overflow-hidden bg-on-background-loading-light dark:bg-on-background-loading-dark mr-2">
          <img className="w-full h-full object-cover" src={photoUrl} />
        </div>
        <div className="flex-1">
          <div className="text-title-medium">{name}</div>
          <div className="text-label-medium">@{username}</div>
        </div>
        {getSendConnectionRequestButton()}
      </div>
    );
  };

  const getSearchedContact = () => {
    if (searchedUser) {
      return (
        <div>
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
      <div
        className="w-fit h-fit bg-primary-light dark:bg-primary-dark rounded-full p-3 ml-5 cursor-pointer"
        onClick={() => searchUser()}
      >
        {SearchIcon("fill-on-primary-light dark:fill-on-primary-dark")}
      </div>
    );
  };

  const getSearchButton = () => {
    return searching ? SpinnerIcon : searchButton();
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="flex justify-between">
        <input
          className="w-[261px] bg-primary-container-light dark:bg-primary-container-dark text-body-large text-on-primary-container-light dark:text-on-primary-container-dark px-6 py-2 border-2 border-outline-light dark:border-outline-dark rounded-full"
          type="text"
          placeholder="Enter username..."
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
