import { useState } from "react";
import {
  DislikeIcon,
  DislikeOutlineIcon,
  FeedbackIcon,
  LikeIcon,
  LikeOutlineIcon,
  SpinnerIcon,
} from "../../common/graphics";
import { FeedbackAction } from "../../common/enums";
import { FeedbackData } from "../../common/types";
import { addFeedback } from "../../services/database";
import { useAppSelector } from "../../hooks/hooks";

export type FeedbackProps = {
  setOpenFeedback: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Feedback({ setOpenFeedback }: FeedbackProps) {
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [feedbackAction, setFeedbackAction] = useState<FeedbackAction>(
    FeedbackAction.NONE
  );
  const [sendingFeedback, setSendingFeedback] = useState<boolean>(false);
  const userUsername = useAppSelector((state) => state.user.username);

  const updateFeedback = () => {
    const newFeedbackText = (
      document.getElementById("feedbackInput") as HTMLInputElement
    ).value;
    setFeedbackText(newFeedbackText);
  };

  const showLikeIcon = () => {
    return feedbackAction === FeedbackAction.LIKE ? LikeIcon : LikeOutlineIcon;
  };

  const showDislikeIcon = () => {
    return feedbackAction === FeedbackAction.DISLIKE
      ? DislikeIcon
      : DislikeOutlineIcon;
  };

  const sendFeedback = async () => {
    setSendingFeedback(true);
    const feedback: FeedbackData = {
      message: feedbackText.trim(),
      status: feedbackAction,
    };
    await addFeedback(userUsername, feedback);
    setOpenFeedback(false);
    setSendingFeedback(false);
  };

  const feedbackButton = (
    <button
      className="primary on-primary-text"
      onClick={() => sendFeedback()}
      id="sendFeedbackButton"
    >
      Submit
    </button>
  );

  const showSubmitFeedbackButton = () => {
    return sendingFeedback ? SpinnerIcon : feedbackButton;
  };

  document.onkeydown = (event) => {
    if (event.key === "Enter") {
      (
        document.getElementById("sendFeedbackButton") as HTMLButtonElement
      ).click();
    }
  };

  return (
    <div className="feedback">
      <div className="feedback-background shadow" />
      <div className="feedback-dialog-container">
        <div className="feedback-dialog surface-container-high">
          <div className="feedback-icon">{FeedbackIcon}</div>
          <div className="feedback-title headline-small on-surface-text">
            Feedback
          </div>
          <div className="feedback-input">
            <textarea
              className="body-medium secondary-container on-secondary-container-text"
              value={feedbackText}
              id="feedbackInput"
              onChange={() => updateFeedback()}
            />
          </div>
          <div className="feedback-actions">
            <div
              className="feedback-actions-like"
              onClick={() => setFeedbackAction(FeedbackAction.LIKE)}
            >
              {showLikeIcon()}
            </div>
            <div
              className="feedback-actions-dislike"
              onClick={() => setFeedbackAction(FeedbackAction.DISLIKE)}
            >
              {showDislikeIcon()}
            </div>
            {showSubmitFeedbackButton()}
          </div>
        </div>
      </div>
    </div>
  );
}
