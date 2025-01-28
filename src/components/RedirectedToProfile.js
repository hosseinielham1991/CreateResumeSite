import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "./loading/Loading";

const RedirectedToProfile = ({ children }) => {
  const location = useLocation();
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const getMember = async () => {
      try {
        const path = location.pathname.split("/")[1];
        const response = await fetch(`/api/members/getPath/${path}`);
        const data = await response.json();
        if (data.error) {
          setAddress("notfound");
          return;
        }
        setAddress(data.info.id); // Assuming your response contains an address field
      } catch (error) {
        console.error(error);
        setAddress("notfound"); // Reset address if there's an error
      }
    };

    getMember();
  }, [location.pathname]);

  if (address === null) {
    // Show loading while waiting for address to be fetched
    return <Loading></Loading>;
  }

  return (
    <Navigate to={`${address === "notfound" ? "" : "/members/"}${address}`} />
  );
};

export default RedirectedToProfile;
