import { FeedbackAction } from "./enums";

export type UserData = {
  username: string;
  name: string;
  photoUrl: string;
};

export type MessageData = {
  sender: string;
  receiver: string;
  message: string;
  timestamp: number;
};

export type GoogleUserData = {
  uid: string;
  name: string;
  photoUrl: string;
};

export type FeedbackData = {
  message: string;
  status: FeedbackAction;
};

export type AddUserInput = {
  uid: string;
  userData: UserData;
};

export type AddConnectionRequestInput = {
  sender: string;
  receiver: string;
};

export type AddMessageInput = {
  messageData: MessageData;
};

export type AcceptConnectionRequestInput = {
  user: string;
  connection: string;
  connectionRequestKey: string;
};
