import { useAppSelector } from "../../hooks/hooks";

export type HomeHeaderProps = {
  initializingUserState: boolean;
};

export default function HomeHeader({ initializingUserState }: HomeHeaderProps) {
  const userName = useAppSelector((state) => state.user.name);
  const userPhotoUrl = useAppSelector((state) => state.user.photoUrl);
  const userUsername = useAppSelector((state) => state.user.username);

  const getLoadingStyle = () => {
    if (initializingUserState) {
      return "animate-pulse";
    }
  };

  const showUserPorfilePhoto = () => {
    if (!initializingUserState) {
      return <img className="w-full h-full object-cover" src={userPhotoUrl} />;
    }
  };

  const showUserUsername = () => {
    if (!initializingUserState) {
      return <>@{userUsername}</>;
    }
  };

  return (
    <div className="flex items-center mb-5">
      <div
        className={`${getLoadingStyle()} w-30 h-30 rounded-full overflow-hidden bg-on-background-loading-light dark:bg-on-background-loading-dark mr-2`}
      >
        {showUserPorfilePhoto()}
      </div>
      <div>
        <div className="text-display-small">{userName}</div>
        <div className="text-label-large">{showUserUsername()}</div>
      </div>
    </div>
  );
}
