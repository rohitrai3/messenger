import { UserData } from "../../common/types";
import { BeforeIcon } from "../../common/graphics";

export type ChatHeaderProps = {
  user: UserData;
  setSelectedConnection: React.Dispatch<React.SetStateAction<UserData | null>>;
};

export default function ChatHeader({
  user,
  setSelectedConnection,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center m-5 mb-2">
      <div
        className="w-fit h-fit bg-secondary-light dark:bg-secondary-dark p-3 rounded-full mr-5 lg:hidden cursor-pointer"
        onClick={() => setSelectedConnection(null)}
      >
        {BeforeIcon("fill-on-secondary-light dark:fill-on-secondary-dark")}
      </div>
      <div className="flex items-center">
        <div
          className={
            "w-15 h-15 bg-on-background-loading-light dark:bg-on-background-loading-dark rounded-full overflow-hidden mr-2"
          }
        >
          <img className="w-fit h-fit object-cover" src={user.photoUrl} />
        </div>
        <div>
          <div className="text-title-medium">{user.name}</div>
          <div className="text-label-medium">@{user.username}</div>
        </div>
      </div>
    </div>
  );
}
