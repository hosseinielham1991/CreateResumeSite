import React, { useEffect, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfileForm from "./tab/ProfileForm";
import AboutForm from "./tab/AboutForm";
import SkillsForm from "./tab/SkilsForm";
import Experience from "./tab/experience/Experience";
import Cv from "./tab/Cv";
import { Tabs } from "antd";
import dayjs from "dayjs";
import { SettinfOfUserContext } from "../DashboardIndex";
import { setTimezone } from "../../../utils/tools";

const Setting = () => {
  const navigate = useNavigate();

  const { settingOfUser } = useContext(SettinfOfUserContext);
  const [profileform, setProfileform] = useState({});
  const [aboutform, setAboutform] = useState({});
  const [skillform, setSkillform] = useState({});
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("setting");

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      const pathParts = location.search.split("?");
      const tabFromPath =
        (pathParts[pathParts.length - 1].split("=")[1] ?? "Profile") + "_tab";
      setActiveTab(tabFromPath);

      const user = settingOfUser;
      // Example date from the database

      setProfileform({
        id: user.id,
        name: user.name,
        family: user.family,
        age: user.age
          ? dayjs(setTimezone({ date: user.age }), "YYYY-MM-DD")
          : "", // Ensure date is in moment object
        gender: user.gender,
        email: user.email,
        linkedin: user.linkedin,
        github: user.github,
        specialties: user.specialties,
        job_position: user.job_position,
        img: user.img,
        city: user.city,
        country: user.country,
        path: user.path == null ? "" : user.path,
        cv: user.cv == null ? "" : user.cv,
        alias_skill: user.alias_skill ==null? "":user.alias_skill,
        alias_experiences: user.alias_experiences ==null? "":user.alias_experiences
      });

      setAboutform({
        about: user.about,
      });

      setSkillform({
        skills: user.skills,
      });
    };

    // Call the fetch function
    fetchData();
  }, [settingOfUser, location.search]);

  const tabchange = (tab) => {
    setActiveTab(tab);
    navigate(`/dashboard/index/?tab=${tab.split("_tab")[0]}`);
  };

  const tabs_item = [
    {
      label: `Profile`,
      key: "Profile_tab",
      children: <ProfileForm dataForm={profileform} />,
    },
    {
      label: `About`,
      key: "About_tab",
      children: <AboutForm dataForm={aboutform} />,
    },
    {
      label: `Skills`,
      key: "Skils_tab",
      children: <SkillsForm dataForm={skillform} />,
    },
    {
      label: `Experience`,
      key: "Experience_tab",
      children: <Experience />,
    },
    {
      label: `File Cv`,
      key: "Cv_tab",
      children: <Cv cv={profileform.cv} userid={profileform.id} />,
    },
  ];

  return (
    <Tabs
      defaultActiveKey="1"
      onTabClick={tabchange}
      tabPosition="top"
      activeKey={activeTab}
      items={tabs_item}
    ></Tabs>
  );
};

export default Setting;
