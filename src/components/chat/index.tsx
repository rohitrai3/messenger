import ChatHeader from "./ChatHeader";
import Conversation from "./Conversation";
import ChatFooter from "./ChatFooter";

export default function Chat() {
  return (
    <div className="chat background">
      <ChatHeader />
      <Conversation />
      <ChatFooter />
    </div>
  );
}
