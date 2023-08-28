import { useState } from "react";
import { signOutUser } from "../../services/authenticate";
import Feedback, { FeedbackProps } from "./Feedback";
import { useAppDispatch } from "../../hooks/hooks";
import { setUserIsAuthenticated } from "../../store/slices/userSlice";
import { PortfolioButton } from "../../common/buttons";

export default function HomeFooter() {
  const [openFeedback, setOpenFeedback] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const feedbackProps: FeedbackProps = {
    setOpenFeedback: setOpenFeedback,
  };

  const showFeedback = () => {
    if (openFeedback) {
      return <Feedback {...feedbackProps} />;
    }
  };

  const signOut = () => {
    signOutUser();
    dispatch(setUserIsAuthenticated(false));
  };

  return (
    <div className="flex justify-between">
      <button
        className="bg-secondary-light dark:bg-secondary-dark text-on-secondary-light dark:text-on-secondary-dark text-label-large px-6 py-3 rounded-full"
        onClick={() => signOut()}
      >
        Sign out
      </button>
      <button
        className="bg-tertiary-light dark:bg-tertiary-dark text-on-tertiary-light dark:text-on-tertiary-dark text-label-large px-6 py-3 rounded-full"
        onClick={() => setOpenFeedback(!openFeedback)}
      >
        Feedback
      </button>
      <PortfolioButton />
      {showFeedback()}
    </div>
  );
}
