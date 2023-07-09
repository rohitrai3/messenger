import { createBrowserRouter } from "react-router-dom";
import SignIn from "../components/signin";

const sign_in = {
  path: "/",
  element: <SignIn />,
};

export const router = createBrowserRouter([sign_in]);
