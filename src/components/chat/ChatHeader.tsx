import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserData } from "../../common/types";
import { getUser } from "../../services/database";
import { BeforeIcon } from "../../common/graphics";

export default function ChatHeader() {
  const location = useLocation();
  const navigate = useNavigate();
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
      return "animate-pulse";
    }
  };

  const showContactProfilePhoto = () => {
    if (!loadingUser) {
      return (
        <img
          className="w-full h-full object-cover"
          src={contactUserData?.photoUrl}
        />
      );
    }
  };

  const showContactUsername = () => {
    if (!loadingUser) {
      return <>@{contactUserData?.username}</>;
    }
  };

  const getContactUserInfo = () => {
    return (
      <div className="flex items-center">
        <div
          className={`${getLoadingStyle()} w-15 h-15 bg-on-background-loading-light dark:bg-on-background-loading-dark rounded-full overflow-hidden mr-2`}
        >
          {showContactProfilePhoto()}
        </div>
        <div>
          <div className="text-title-medium">{contactUserData?.name}</div>
          <div className="text-label-medium">{showContactUsername()}</div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    loadContactUserData();
  }, []);

  return (
    <div className="flex items-center">
      <div
        className="w-fit h-fit bg-secondary-light dark:bg-secondary-dark p-3 rounded-full mr-5"
        onClick={() => navigate(-1)}
      >
        {BeforeIcon("fill-on-secondary-light dark:fill-on-secondary-dark")}
      </div>
      {getContactUserInfo()}
    </div>
  );
}
