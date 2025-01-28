// ProtectedRoute.js

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../App";

const RedirectedRoute = ({ children }) => {
  const { userinfo } = useContext(UserContext);

  if (userinfo.id !== undefined) {
    return <Navigate to="/dashboard/index/" />; // Show loading while `userinfo` is undefined
  }

  return children;
};

export default RedirectedRoute;
