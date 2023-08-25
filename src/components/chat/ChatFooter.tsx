import { useLocation, useNavigate } from "react-router-dom";
import { BeforeIcon, SendIcon, SpinnerIcon } from "../../common/graphics";
import { useState } from "react";
import { addMessage } from "../../services/database";
import { useAppSelector } from "../../hooks/hooks";
import { AddMessageInput } from "../../common/types";

export default function ChatFooter() {
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState<string>("");
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const userUsername = useAppSelector((state) => state.user.username);
  const location = useLocation();
  const contactUser = location.state.username;

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
          receiver: contactUser,
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
          className="primary-action-icon primary"
          onClick={() => sendMessage()}
          id="sendMessageButton"
        >
          {SendIcon}
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
    <div className="chat-footer">
      <div
        className="secondary-action-icon secondary"
        onClick={() => navigate(-1)}
      >
        {BeforeIcon}
      </div>
      <div className="message-input">
        <input
          className="body-large primary-container on-primary-container-text"
          type="text"
          placeholder="Enter message"
          value={messageText}
          onChange={() => updateMessage()}
          id="messageInput"
        />
      </div>
      {getSendButton()}
    </div>
  );
}
