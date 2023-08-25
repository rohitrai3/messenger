import MessengerDarkLogo from "../../resources/messenger_logo_with_text_dark.png";
import MessengerLightLogo from "../../resources/messenger_logo_with_text_light.png";
import { selectAppTheme } from "../../store/slices/appSlice";
import { useAppSelector } from "../../hooks/hooks";
import { Theme } from "../../common/enums";

export default function SignInHeader() {
  const theme = useAppSelector(selectAppTheme);

  const getMessengerLogo = () => {
    return theme === Theme.LIGHT ? MessengerLightLogo : MessengerDarkLogo;
  };
  return (
    <div className="mb-20">
      <div className="text-display-small text-center">Welcome to</div>
      <div className="w-[361px] mt-2">
        <img src={getMessengerLogo()} alt="Messenger logo" />
      </div>
    </div>
  );
}
