import { createBrowserRouter } from "react-router-dom";
import SignIn from "../components/signIn";
import Home from "../components/home";

const sign_in = {
  path: "/",
  element: <SignIn />,
};

const home = {
  path: "/",
  element: <Home />,
};

export const router = createBrowserRouter([sign_in]);

export const authenticatedRouter = createBrowserRouter([home]);
