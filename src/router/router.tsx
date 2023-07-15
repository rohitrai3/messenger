import { createBrowserRouter } from "react-router-dom";
import SignIn from "../components/sing_in";
import Home from "../components/home";
import Chat from "../components/chat";

const sign_in = {
  path: "/",
  element: <SignIn />,
};

const home = {
  path: "/",
  element: <Home />,
};

const chat = {
  path: "/chat",
  element: <Chat />,
};

export const router = createBrowserRouter([sign_in]);

export const authenticatedRouter = createBrowserRouter([home, chat]);
