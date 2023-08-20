import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserData } from "../../common/types";
import { getUser } from "../../services/database";

export default function ChatHeader() {
  const location = useLocation();
  const contactUsername = location.state.username;
  const [contactUserData, setConnectUserData] = useState<UserData>();
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  const loadContactUserData = async () => {
    setLoadingUser(true);
    const userData = await getUser(contactUsername);
    setConnectUserData(userData);
    setLoadingUser(false);
  };

  const getLoadingStyle = () => {
    if (loadingUser) {
      return "surface-dim";
    }
  };

  const showContactProfilePhoto = () => {
    if (!loadingUser) {
      return <img src={contactUserData?.photoUrl} />;
    }
  };

  const showContactUsername = () => {
    if (!loadingUser) {
      return <>@{contactUserData?.username}</>;
    }
  };

  const getContactUserInfo = () => {
    return (
      <div className="contact-user-info">
        {showContactProfilePhoto()}
        <div className="contact-user-name">
          <div className="headline-large">{contactUserData?.name}</div>
          <div className="label-large">{showContactUsername()}</div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    loadContactUserData();
  }, []);

  return (
    <div className="chat-header on-background-text">
      <div className="chat-heading headline-medium">You are talking to</div>
      <div className={`chat-user-info ${getLoadingStyle()}`}>
        {getContactUserInfo()}
      </div>
    </div>
  );
}
