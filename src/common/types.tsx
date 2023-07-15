import { FeedbackAction } from "./enums";

export type UserData = {
  username: string;
  name: string;
  photoUrl: string;
};

export type Message = {
  message: string;
  sender: string;
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
