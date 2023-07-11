import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";
import ChatHeader from "./ChatHeader";
import Conversation from "./Conversation";
import ChatFooter from "./ChatFooter";

export default function Chat() {
  const userUsername = useAppSelector((state) => state.user.username);
  const navigate = useNavigate();

  useEffect(() => {
    if (userUsername === "Unknown") {
      navigate("/");
    }
  });
  return (
    <div className="chat background">
      <ChatHeader />
      <Conversation />
      <ChatFooter />
    </div>
  );
}
