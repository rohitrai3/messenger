import Pusher from "pusher-js";
import { MessageData } from "../common/types";

const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
  cluster: "ap2",
});

export const startLiveChat = (
  chatName: string,
  setMessages: React.Dispatch<React.SetStateAction<MessageData[]>>
) => {
  pusher.allChannels().forEach((channel) => {
    pusher.unsubscribe(channel.name);
  });
  pusher.subscribe(chatName).bind("my-event", (data: MessageData) => {
    setMessages((messages) => [data, ...messages]);
  });
};

export default startLiveChat;
