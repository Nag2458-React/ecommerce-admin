import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({
  children,
}) => {

  const user =
    localStorage.getItem("user");

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  return children;
};

export default UserProtectedRoute;

// this component uses for when user logout, top left arrow dont go back pages, only show login.jsx .. dont go back page history