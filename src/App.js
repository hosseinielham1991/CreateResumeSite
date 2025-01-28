// App.js
import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MembersList from "./view/home/MembersList";
import MemberDetails from "./view/memberdetails/MemberDetails";
import Loading from "./components/loading/Loading";
import "bootstrap/dist/css/bootstrap.min.css";
import {  LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import LoginPage from "./view/login/LoginPage";
import DashboardIndex from "./view/dashboard/DashboardIndex";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectedRoute from "./components/RedirectedRoute";
import RedirectedToProfile from "./components/RedirectedToProfile";
import { ConfigProvider } from "antd";
import "react-image-crop/dist/ReactCrop.css";
import axiosInstance from "./utils/axiosInstance";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/infoSlice";
import SignupPage from "./view/signup/SignupPage";
import ForgotpasswordPage from "./view/forgotpassword/Forgotpassword";
import Error404 from "./components/error404/Error404";
const UserContext = createContext(null);

function App() {
  const dispatch = useDispatch();

  //flag for load css
  const [isLoading, setIsLoading] = useState(true);

  // this flag  was in true if user loged in
  const [, setIsAuthenticated] = useState(false);
  // User information state
  const [userinfo, setUserInfo] = useState({});

  const [imageversion] = useState(
    Math.floor(Math.random() * 1000)
  );
  useEffect(() => {
    //this funtion check if user logined
    async function checkAuthentication() {
      try {
        //get user if loged in
        const response = await fetch("/api/login/info");
        //if request is success
        if (response.ok) {
          //conver dat to json
          const data = await response.json();
          // Set authenticated to true if the fetch call is successful
          setIsAuthenticated(true); // Set authenticated to true if the fetch call is successful
          // Set the user info from the response

          setUserInfo({ ...data.info, login: true });
          dispatch(setUser({ ...data.info, login: true }));
        } else {
          // Set authenticated to true if the fetch call is failed
          setIsAuthenticated(false); // Set authenticated to false if the fetch call isn't successful
        }
      } catch (error) {
        // Set authenticated to true if the fetch call is failed
        setIsAuthenticated(false);
      } finally {
        // Set gettingInfo to true

        setIsLoading(false);
      }
    }

    checkAuthentication();
  }, [setIsAuthenticated, dispatch]);

  let colorPrimary;
  if (typeof window !== "undefined") {
    const style = getComputedStyle(document.body);
    colorPrimary = style.getPropertyValue("--primary-color-text");
  }

  const logout = async (e) => {
    await axiosInstance.post("/api/dashboard/logout").then(() => {
      window.location.href = "/login";
    });

    e.preventDefault();
    e.stopPropagation();
  };

  if (isLoading === true) {
    return <Loading hide={!isLoading}></Loading>;
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: colorPrimary,
        },
      }}
    >
      <UserContext.Provider value={{ userinfo, setUserInfo }}>
        <Router>
          <div className="cv-header    d-flex flex-row align-items-center justify-content-center ">
            <div className="cv-with-column cv-header-logo-and-btn d-flex flex-row ">
              <div className="cv-holderlogo d-flex flex-row align-items-center p-2 ">
                <Link alt="CVisionary.ir" to="/">
                  <img className="cv-logo" alt="CVisionary" src="/logo.png" />
                </Link>
              </div>
              <div className="cv-holderMenu d-flex flex-row-reverse  align-items-center">
                {!userinfo.login && (
                  <>
                    <a
                      className="cv-link-header rounded cv-join-now"
                      alt="CVisionary.ir signup"
                      href="/signup"
                    >
                      <span className="d-flex flex-row align-items-center">
                        <span className="cv-btn-header-label">Join now</span>
                      </span>
                    </a>
                    <a
                      className="cv-link-header rounded"
                      alt="CVisionary.ir login"
                      href="/login"
                    >
                      <span className="d-flex flex-row align-items-center">
                        <LoginOutlined className="cv-btn-header" />
                        <span className="cv-btn-header-label">Sign in</span>
                      </span>
                    </a>
                  </>
                )}
                {userinfo.login && (
                  <Link to="/dashboard/index/">
                    <div className=" rounded  me-2" alt="User profile">
                      <span className="d-flex flex-row align-items-center">
                        <img
                          src={`/api/members/img/${userinfo.id}?v=${imageversion}`} // The property containing the user's image URL
                          className="cv-user-profile-image rounded-circle "
                          alt={userinfo.name}
                        />
                      </span>
                    </div>
                  </Link>
                )}
                {userinfo.login && (
                  <span
                    className="cv-link-header rounded"
                    alt="CVisionary.ir logout"
                    onClick={logout}
                  >
                    <span className="d-flex flex-row align-items-center">
                      <LogoutOutlined type="danger" className="cv-btn-header" />
                      <span className="cv-btn-header-label">sign out</span>
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="cv-main-holder   ">
            <Loading hide={!isLoading}></Loading>
            <Routes>
              <Route
                path="/login"
                element={
                  <RedirectedRoute>
                    <LoginPage />
                  </RedirectedRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <RedirectedRoute>
                    <SignupPage />
                  </RedirectedRoute>
                }
              />
              <Route
                path="/forgotpassword"
                element={
                  <RedirectedRoute>
                    <ForgotpasswordPage />
                  </RedirectedRoute>
                }
              />
              <Route path="/" element={<MembersList />} />
              <Route path="/members/:memberId" element={<MemberDetails />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardIndex />
                  </ProtectedRoute>
                }
              />
              <Route path="/notfound" element={<Error404></Error404>} />
              <Route
                path="/*"
                element={<RedirectedToProfile></RedirectedToProfile>}
              />
            </Routes>
          </div>
        </Router>
      </UserContext.Provider>
    </ConfigProvider>
  );
}

export { UserContext }; // Export the context as a named export
export default App;
