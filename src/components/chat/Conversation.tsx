import { useEffect, useState } from "react";
import { MessageData } from "../../common/types";
import { getChatName, getMessages } from "../../services/database";
import { useAppSelector } from "../../hooks/hooks";
import { SpinnerIcon } from "../../common/graphics";
import startLiveChat from "../../services/pusher";

export type ConversationProps = {
  connectionUsername: string;
};

export default function Conversation({
  connectionUsername,
}: ConversationProps) {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const userUsername = useAppSelector((state) => state.user.username);

  const loadMessages = async () => {
    setLoadingMessages(true);
    const messageDataList = await getMessages(userUsername, connectionUsername);
    setMessages(
      messageDataList.sort((message1, message2) =>
        message1.timestamp > message2.timestamp ? -1 : 1
      )
    );
    const chatName = await getChatName(userUsername, connectionUsername);
    startLiveChat(chatName, setMessages);
    setLoadingMessages(false);
  };

  const showSenderMessage = (messageText: string, timestamp: number) => {
    return (
      <div
        key={timestamp}
        className="max-w-[80%] w-fit bg-primary-container-light dark:bg-primary-container-dark text-on-primary-container-light dark:text-on-primary-container-dark text-body-large rounded-l-3xl px-6 py-2 self-end break-all my-1"
      >
        {messageText}
      </div>
    );
  };

  const showReceiverMessage = (messageText: string, timestamp: number) => {
    return (
      <div
        key={timestamp}
        className="max-w[80%] w-fit bg-secondary-container-light dark:bg-secondary-container-dark text-on-secondary-container-light dark:text-on-secondary-container-dark text-body-large rounded-r-3xl px-6 py-2 self-start break-all my-1"
      >
        {messageText}
      </div>
    );
  };

  const getMessageList = () => {
    if (loadingMessages) {
      return SpinnerIcon;
    } else {
      return messages?.map((message) => {
        if (message.sender === userUsername) {
          return showSenderMessage(message.message, message.timestamp);
        } else {
          return showReceiverMessage(message.message, message.timestamp);
        }
      });
    }
  };

  useEffect(() => {
    loadMessages();
  }, [connectionUsername]);

  return (
    <div className="flex-1 flex flex-col-reverse overflow-auto">
      {getMessageList()}
    </div>
  );
}
