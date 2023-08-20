import { RouterProvider } from "react-router-dom";
import { authenticatedRouter, router } from "../router/router";
import "../styles/theme.css";
import { useEffect, useState } from "react";
import { checkAuthentication } from "../services/authenticate";
import { SpinnerIcon } from "../common/icons";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { setUserIsAuthenticated } from "../store/slices/userSlice";

function App() {
  const isUserAuthenticated = useAppSelector(
    (state) => state.user.isAuthenticated
  );
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

  useEffect(() => {
    checkUserSignIn();
  }, [isUserSignedIn]);

  return getRoutes();
}

export default App;
