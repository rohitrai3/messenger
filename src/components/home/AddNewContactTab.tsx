import { useState } from "react";
import { SearchUserResponse } from "../../common/types";
import { getUserData } from "../../services/database";
import { SearchIcon, SpinnerIcon, TickIcon } from "../../common/icons";

export default function AddNewContactTab() {
  const [username, setUsername] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [searchedUser, setSearchedUser] = useState<SearchUserResponse>();

  const updateUsername = () => {
    const searchUserInputValue = (
      document.getElementById("searchUserInput") as HTMLInputElement
    ).value;
    setUsername(searchUserInputValue);
  };

  const searchUser = async () => {
    setSearching(true);
    const searchUserResponse = await getUserData(username);
    setSearchedUser(searchUserResponse);
    setSearching(false);
  };

  const getSearchedContact = () => {
    if (searchedUser) {
      return (
        <div className="searched-contact">
          <div className="user-info">
            <img src={searchedUser.photoUrl} />
            <div className="headline-small on-primary-container-text">
              {searchedUser.name}
            </div>
          </div>
          <div className="secondary-action-icon secondary">{TickIcon}</div>
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
    </div>
  );
}
