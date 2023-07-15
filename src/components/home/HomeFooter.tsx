import { useState } from "react";
import { signOutUser } from "../../services/authenticate";
import Feedback, { FeedbackProps } from "./Feedback";

export default function HomeFooter() {
  const [openFeedback, setOpenFeedback] = useState<boolean>(false);

  const feedbackProps: FeedbackProps = {
    setOpenFeedback: setOpenFeedback,
  };

  const showFeedback = () => {
    if (openFeedback) {
      return <Feedback {...feedbackProps} />;
    }
  };
  return (
    <div className="home-footer">
      <button
        className="sign-out-button label-large"
        onClick={() => signOutUser()}
      >
        Sign out
      </button>
      <button
        className="feedback-button label-large"
        onClick={() => setOpenFeedback(!openFeedback)}
      >
        Feedback
      </button>
      <a href="https://rohitrai.dev">
        <button className="portfolio-button label-large">Portfolio</button>
      </a>
      {showFeedback()}
    </div>
  );
}
