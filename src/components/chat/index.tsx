import ChatHeader from "./ChatHeader";
import Conversation from "./Conversation";
import ChatFooter from "./ChatFooter";
import { Theme } from "../../common/enums";
import { DarkModeButton, LightModeButton } from "../../common/buttons";
import { useAppSelector } from "../../hooks/hooks";
import { selectAppTheme } from "../../store/slices/appSlice";

export default function Chat() {
  const theme = useAppSelector(selectAppTheme);

  const getThemeButton = () => {
    return theme === Theme.LIGHT ? <LightModeButton /> : <DarkModeButton />;
  };

  return (
    <div className="w-d-screen h-d-screen flex flex-col p-4">
      {getThemeButton()}
      <ChatHeader />
      <Conversation />
      <ChatFooter />
    </div>
  );
}
