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
      return "surface-dim";
    }
  };

  const showUserPorfilePhoto = () => {
    if (!initializingUserState) {
      return <img src={userPhotoUrl} />;
    }
  };

  return (
    <div className="home-header">
      <div className="home-header-heading display-small on-background-text">
        Hello!
      </div>
      <div className={`user-info ${getLoadingStyle()}`}>
        <div className="user-profile-photo">{showUserPorfilePhoto()}</div>
        <div className="user-name">
          <div className="display-medium on-background-text">{userName}</div>
          <div className="label-large on-background-text">@{userUsername}</div>
        </div>
      </div>
      <div className="home-horizontal-line" />
    </div>
  );
}
