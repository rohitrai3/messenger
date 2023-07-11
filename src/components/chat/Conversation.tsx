import { useEffect, useState } from "react";
import { Message } from "../../common/types";
import { getMessagesOnUpdate } from "../../services/database";
import { useAppSelector } from "../../hooks/hooks";
import { useLocation } from "react-router-dom";
import { SpinnerIcon } from "../../common/icons";

export default function Conversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const userUsername = useAppSelector((state) => state.user.username);
  const location = useLocation();
  const contactUsername = location.state.username;

  const loadMessages = async () => {
    setLoadingMessages(true);
    await getMessagesOnUpdate(userUsername, contactUsername, setMessages);
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

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div className="conversation">
      <div className="conversation-heading title-small on-surface-variant-text">
        Messages
      </div>
      {getMessageList()}
    </div>
  );
}
