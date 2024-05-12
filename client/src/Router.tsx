import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Login from "./pages/LoginPage";
import RegistrationPage from "./pages/RegisterPage";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/Login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <RegistrationPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
