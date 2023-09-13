import "../styles/style.css";
import "../styles/typography.css";
import { RouterProvider } from "react-router-dom";
import { authenticatedRouter, router } from "../router/router";
import { useEffect, useState } from "react";
import { checkAuthentication } from "../services/authenticate";
import { SpinnerIcon } from "../common/graphics";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  selectUserIsAuthenticated,
  setUserIsAuthenticated,
} from "../store/slices/userSlice";
import { setAppTheme } from "../store/slices/appSlice";
import { Theme } from "../common/enums";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const isUserAuthenticated = useAppSelector(selectUserIsAuthenticated);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUserSignedIn, setIsUserSignedIn] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const checkUserSignIn = () => {
    checkAuthentication(setIsUserSignedIn, setLoading);
    if (isUserSignedIn) {
      dispatch(setUserIsAuthenticated(true));
    }
  };

  const getRoutes = () => {
    if (loading) {
      return SpinnerIcon;
    } else if (isUserAuthenticated) {
      return <RouterProvider router={authenticatedRouter} />;
    } else {
      return <RouterProvider router={router} />;
    }
  };

  const setThemeFromLocalOrSystem = () => {
    if (
      localStorage.getItem("theme") === Theme.DARK ||
      (!("theme" in localStorage) &&
        window.matchMedia(`(prefers-color-scheme: ${Theme.DARK}`).matches)
    ) {
      document.documentElement.classList.add(Theme.DARK);
      dispatch(setAppTheme(Theme.DARK));
    } else {
      document.documentElement.classList.remove(Theme.DARK);
      localStorage.setItem("theme", Theme.LIGHT);
      dispatch(setAppTheme(Theme.LIGHT));
    }
  };

  const setBodyStyle = () => {
    document.body.classList.add("bg-background-light");
    document.body.classList.add("text-on-background-light");
    document.body.classList.add("dark:bg-background-dark");
    document.body.classList.add("dark:text-on-background-dark");
  };

  useEffect(() => {
    checkUserSignIn();
  }, [isUserSignedIn]);

  useEffect(() => {
    setThemeFromLocalOrSystem();
    setBodyStyle();
  }, []);

  return (
    <>
      <Analytics />
      {getRoutes()}
    </>
  );
}

export default App;
