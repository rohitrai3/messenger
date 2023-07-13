import { RouterProvider } from "react-router-dom";
import { authenticatedRouter, router } from "../router/router";
import "../styles/theme.css";
import { useEffect, useState } from "react";
import { checkAuthentication } from "../services/authenticate";
import { SpinnerIcon } from "../common/icons";

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState<boolean>(false);

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
    checkAuthentication(setLoading, setIsUserAuthenticated);
  }, []);

  return getRoutes();
}

export default App;
