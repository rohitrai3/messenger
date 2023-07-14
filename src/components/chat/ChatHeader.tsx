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

  const getLoadingStyle = () => {
    if (loadingUser) {
      return "hide-text surface-dim";
    }
  };

  const getContactUserInfo = () => {
    return (
      <div className={`contact-user-info ${getLoadingStyle()}`}>
        <img src={contactUserData?.photoUrl} />
        <div className="contact-user-name">
          <div className="headline-small">{contactUserData?.name}</div>
          <div className="label-medium">@{contactUserData?.username}</div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    loadContactUserData();
  }, []);

  return (
    <div className="chat-header on-background-text">
      <div className="chat-heading display-small">You are talking to</div>
      <div className="chat-header-user-info">{getContactUserInfo()}</div>
    </div>
  );
}
