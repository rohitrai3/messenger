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
    setMessages(
      messageDataList.sort((message1, message2) =>
        message1.timestamp < message2.timestamp ? -1 : 1
      )
    );
    setLoadingMessages(false);
  };

  const showSenderMessage = (messageText: string, timestamp: number) => {
    return (
      <div
        key={timestamp}
        className="max-w-[80%] w-fit bg-primary-container-light dark:bg-primary-container-dark text-on-primary-container-light dark:text-on-primary-container-dark text-body-large rounded-l-3xl px-6 py-2 self-end break-all"
      >
        {messageText}
      </div>
    );
  };

  const showReceiverMessage = (messageText: string, timestamp: number) => {
    return (
      <div
        key={timestamp}
        className="max-w[80%] w-fit bg-secondary-container-light dark:bg-secondary-container-dark text-on-secondary-container-light dark:text-on-secondary-container-dark text-body-large rounded-r-3xl px-6 py-2 self-start break-all"
      >
        {messageText}
      </div>
    );
  };

  const getMessageList = () => {
    if (loadingMessages) {
      return SpinnerIcon;
    } else {
      return (
        <div className="w-d-screen -ml-4 my-5 space-y-2 flex-1 flex flex-col-reverse overflow-auto">
          {messages?.map((message) => {
            if (message.sender === userUsername) {
              return showSenderMessage(message.message, message.timestamp);
            } else {
              return showReceiverMessage(message.message, message.timestamp);
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

  return getMessageList();
}
