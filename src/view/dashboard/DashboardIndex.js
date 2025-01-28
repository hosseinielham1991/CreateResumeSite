import React, { useEffect, useState, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import styles from "./DashboardIndex.module.css";
import CropImage from "../../components/cropimage/CropImage";
import Privacy from "./modal/Privacy";
import Setting from "./setting/Setting";
import ExperienceEdit from "./experienceEdit/ExperienceEdit";
import ExperienceDetails from "../dashboard/ExperienceDetails/ExperienceDetails";
import { useSelector } from "react-redux";
import Title from "../../components/Title";
const SettinfOfUserContext = createContext(null);

const DashboardIndex = () => {
  const userinfo = useSelector((state) => state.public.userinfo);
  const [settingOfUser, setSettingOfUser] = useState({});

  useEffect(() => {
    // Function to fetch data
    // Function to fetch data
    const fetchData = async () => {
      try {
        await axiosInstance
          .post("/api/dashboard/getinfo")
          .then(function (res) {
            setSettingOfUser(res.data.info.user);
          })
          .catch((error) => {
            console.error("Fetching data failed:", error);
          });
        // Assuming the response data's structure matches the form fields
      } catch (error) {
        console.error("Fetching data failed:", error);
      }
    };

    // Call the fetch function
    fetchData();
  }, []);

  return (
    <SettinfOfUserContext.Provider value={{ settingOfUser }}>
      <Title>{userinfo.name + " " + userinfo.family}</Title>
      <div className={" container p-4"}>
        <div className="row gutters">
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
            <div className={styles.holderImg + " card "}>
              <div className="card-body">
                <div className={styles.accountSettings}>
                  <div className={styles.userProfile}>
                    <CropImage
                      hasValue={(settingOfUser.img ?? "") !== ""}
                      saveUrl={"/dashboard/updateProfileImage"}
                      viewUrl={"/api/members/img/" + userinfo.id}
                      title={userinfo.name + " " + userinfo.family}
                    >
                      <CropImage.View
                        src={"/api/members/img/" + userinfo.id}
                        alt={userinfo.name + " " + userinfo.family}
                      ></CropImage.View>
                    </CropImage>

                    <h5 className={styles.userName}>
                      {userinfo.name + " " + userinfo.family}
                    </h5>
                    <h6 className={styles.username}>@{userinfo.username}</h6>
                    <Privacy></Privacy>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
            <div className={styles.holderImg + " card h-100"}>
              <div className="card-body">
                <Routes>
                  <Route path="/index" element={<Setting />} />
                  <Route
                    path="/index/experience/:experienceId"
                    element={<ExperienceEdit />}
                  />
                  <Route
                    path="/index/experience/details/:experienceId/:experienceTitle"
                    element={<ExperienceDetails />}
                  />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettinfOfUserContext.Provider>
  );
};

export { SettinfOfUserContext };
export default DashboardIndex;
