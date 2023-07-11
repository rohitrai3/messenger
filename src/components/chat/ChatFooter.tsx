import { useNavigate } from "react-router-dom";
import { BeforeIcon, SendIcon } from "../../common/icons";

export default function ChatFooter() {
  const navigate = useNavigate();

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
        />
      </div>
      <div className="primary-action-icon primary">{SendIcon}</div>
    </div>
  );
}
