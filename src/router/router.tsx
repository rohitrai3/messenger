import { createBrowserRouter } from "react-router-dom";
import SignIn from "../components/signin";
import Home from "../components/home";

const sign_in = {
  path: "/",
  element: <SignIn />,
};

const home = {
  path: "/home",
  element: <Home />,
};

export const router = createBrowserRouter([sign_in, home]);
