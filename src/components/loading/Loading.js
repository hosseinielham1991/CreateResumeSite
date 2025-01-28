import React, { useEffect, useState } from "react";
import "./Loading.css";

function Loading({ hide = false }) {
  const [show, seteShow] = useState(true);

  useEffect(() => {
    async function hideLoading() {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Sleep for 5 seconds
      seteShow(false);
    }

    if (hide === true) {
      hideLoading();
    }
  }, [hide]);

  return (
    <div
      className={
        (show ? "" : "d-none") +
        " preloader d-flex justify-content-center align-items-center"
      }
    >
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
    </div>
  );
}

export default Loading;
