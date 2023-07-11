import { createBrowserRouter } from "react-router-dom";
import SignIn from "../components/signin";
import Home from "../components/home";
import Chat from "../components/chat";

const sign_in = {
  path: "/",
  element: <SignIn />,
};

const home = {
  path: "/home",
  element: <Home />,
};

const chat = {
  path: "/chat",
  element: <Chat />,
};

export const router = createBrowserRouter([sign_in, home, chat]);
