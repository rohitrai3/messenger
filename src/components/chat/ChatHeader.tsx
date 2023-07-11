import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserData } from "../../common/types";
import { getUserData } from "../../services/database";
import { SpinnerIcon } from "../../common/icons";

export default function ChatHeader() {
  const location = useLocation();
  const contactUsername = location.state.username;
  const [contactUserData, setConnectUserData] = useState<UserData>();
  const [loadingUser, setLoadingUser] = useState<boolean>(false);

  const loadContactUserData = async () => {
    setLoadingUser(true);
    const userData = await getUserData(contactUsername);
    setConnectUserData(userData);
    setLoadingUser(false);
  };

  const getContactUserInfo = () => {
    if (loadingUser) {
      return SpinnerIcon;
    } else {
      return (
        <div className="chat-user-info">
          <img src={contactUserData?.photoUrl} />
          <div className="chat-user-name">
            <div className="headline-large">{contactUserData?.name}</div>
            <div className="label-large">@{contactUserData?.username}</div>
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    loadContactUserData();
  }, []);

  return (
    <div className="chat-header on-background-text">
      <div className="display-small">You are talking to</div>
      {getContactUserInfo()}
    </div>
  );
}
