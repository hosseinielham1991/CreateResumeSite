// ProtectedRoute.js

import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../App";
import Loading from "./loading/Loading";
const ProtectedRoute = ({ children }) => {
  const { userinfo } = useContext(UserContext);
  const [isAuthenticated, setIsAuthenticated] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(userinfo.id !== undefined);
    setIsLoading(false);
  }, [userinfo]);

  if (isLoading) {
    return <Loading></Loading>; // Show loading while `userinfo` is undefined
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
