import ChatHeader, { ChatHeaderProps } from "./ChatHeader";
import Conversation, { ConversationProps } from "./Conversation";
import ChatFooter, { ChatFooterProps } from "./ChatFooter";
import { Theme } from "../../common/enums";
import { DarkModeButton, LightModeButton } from "../../common/buttons";
import { useAppSelector } from "../../hooks/hooks";
import { selectAppTheme } from "../../store/slices/appSlice";
import EmptyChatWindow from "./EmptyChatWindow";
import { UserData } from "../../common/types";

export type ChatProps = {
  connection: UserData | null;
  setSelectedConnection: React.Dispatch<React.SetStateAction<UserData | null>>;
};

export default function Chat({ connection, setSelectedConnection }: ChatProps) {
  const theme = useAppSelector(selectAppTheme);
  const chatHeaderProps: ChatHeaderProps = {
    user: connection!,
    setSelectedConnection: setSelectedConnection,
  };
  const chatFooterProps: ChatFooterProps = {
    connectionUsername: connection?.username!,
  };
  const conversationProps: ConversationProps = {
    connectionUsername: connection?.username!,
  };

  const getThemeButton = () => {
    return theme === Theme.LIGHT ? <LightModeButton /> : <DarkModeButton />;
  };

  const chatWindow = (
    <div className="w-full h-d-screen flex flex-col">
      {getThemeButton()}
      <ChatHeader {...chatHeaderProps} />
      <Conversation {...conversationProps} />
      <ChatFooter {...chatFooterProps} />
    </div>
  );

  const showChatWindow = () => {
    return connection ? chatWindow : <EmptyChatWindow />;
  };

  return (
    <div className="h-full lg:bg-surface-light lg:dark:bg-surface-dark lg:text-on-surface-light lg:dark:text-on-surface-dark lg:rounded-3xl lg:mx-6 flex justify-center items-center">
      {showChatWindow()}
    </div>
  );
}
