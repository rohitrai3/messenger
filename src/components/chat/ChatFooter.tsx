import { SendIcon, SpinnerIcon } from "../../common/graphics";
import { useState } from "react";
import { addMessage } from "../../services/database";
import { useAppSelector } from "../../hooks/hooks";
import { AddMessageInput } from "../../common/types";

export type ChatFooterProps = {
  connectionUsername: string;
};

export default function ChatFooter({ connectionUsername }: ChatFooterProps) {
  const [messageText, setMessageText] = useState<string>("");
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const userUsername = useAppSelector((state) => state.user.username);

  const updateMessage = () => {
    const newMessageText = (
      document.getElementById("messageInput") as HTMLInputElement
    ).value;
    setMessageText(newMessageText);
  };

  const validMessage = messageText.trim().length > 0;

  const sendMessage = async () => {
    setSendingMessage(true);
    if (validMessage) {
      const addMessageInput: AddMessageInput = {
        messageData: {
          sender: userUsername,
          receiver: connectionUsername,
          message: messageText.trim(),
          timestamp: Date.now(),
        },
      };
      await addMessage(addMessageInput);
      setMessageText("");
    }
    setSendingMessage(false);
  };

  const getSendButton = () => {
    if (sendingMessage) {
      return SpinnerIcon;
    } else {
      return (
        <div
          className="w-fit h-fit bg-primary-light dark:bg-primary-dark p-3 rounded-full ml-5 cursor-pointer"
          onClick={() => sendMessage()}
          id="sendMessageButton"
        >
          {SendIcon("fill-on-primary-light dark:fill-on-primary-dark")}
        </div>
      );
    }
  };

  document.onkeydown = (event) => {
    if (event.key === "Enter") {
      (
        document.getElementById("sendMessageButton") as HTMLButtonElement
      ).click();
    }
  };

  return (
    <div className="flex m-4 mt-2">
      <input
        className="bg-primary-container-light dark:bg-primary-container-dark text-on-primary-container-light dark:text-on-primary-container-dark text-body-large px-6 py-2 border-2 border-outline-light dark:border-outline-dark rounded-full flex-1"
        type="text"
        placeholder="Enter message"
        value={messageText}
        onChange={() => updateMessage()}
        id="messageInput"
      />
      {getSendButton()}
    </div>
  );
}
