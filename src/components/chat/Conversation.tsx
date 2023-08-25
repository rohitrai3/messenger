import { useEffect, useState } from "react";
import { MessageData } from "../../common/types";
import { getMessages, getUser, getUsername } from "../../services/database";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useLocation } from "react-router-dom";
import { SpinnerIcon } from "../../common/graphics";
import { getAuthenticatedGoogleUserData } from "../../services/authenticate";
import {
  setUserName,
  setUserPhotoUrl,
  setUserUid,
  setUserUsername,
} from "../../store/slices/userSlice";

export default function Conversation() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const userUsername = useAppSelector((state) => state.user.username);
  const location = useLocation();
  const contactUsername = location.state.username;
  const dispatch = useAppDispatch();

  const loadMessages = async () => {
    setLoadingMessages(true);
    const messageDataList = await getMessages(userUsername, contactUsername);
    setMessages(messageDataList);
    setLoadingMessages(false);
  };

  const getUserMessageView = (messageText: string, timestamp: number) => {
    return (
      <div className="message-right body-large on-primary-text" key={timestamp}>
        <div className="message-user primary">{messageText}</div>
      </div>
    );
  };

  const getContactMessageView = (messageText: string, timestamp: number) => {
    return (
      <div
        className="message-left body-large on-secondary-text"
        key={timestamp}
      >
        <div className="message-contact secondary">{messageText}</div>
      </div>
    );
  };

  const getMessageList = () => {
    if (loadingMessages) {
      return SpinnerIcon;
    } else {
      return (
        <div className="messages">
          {messages?.map((message) => {
            if (message.sender === userUsername) {
              return getUserMessageView(message.message, message.timestamp);
            } else {
              return getContactMessageView(message.message, message.timestamp);
            }
          })}
        </div>
      );
    }
  };

  const setUserStateOnRefresh = async () => {
    const googleUserData = getAuthenticatedGoogleUserData();
    const username = await getUsername(googleUserData.uid);
    const userData = await getUser(username);
    dispatch(setUserUid(googleUserData.uid));
    dispatch(setUserUsername(username));
    dispatch(setUserName(userData.name));
    dispatch(setUserPhotoUrl(userData.photoUrl));
    sessionStorage.clear();
  };

  useEffect(() => {
    if (userUsername.length === 0) {
      setUserStateOnRefresh();
    }
    loadMessages();
  }, [userUsername]);

  return (
    <div className="conversation">
      <div className="conversation-heading title-small on-surface-variant-text">
        Messages
      </div>
      {getMessageList()}
    </div>
  );
}
