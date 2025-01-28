// components/MemberDetails.js
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./MemberDetails.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faUser } from "@fortawesome/free-regular-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import TypingAnimation from "../../components/TypingAnimation";
import {
  FundProjectionScreenOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Bubbles from "../../components/bubbles/Bubbles";
import ExperienceList from "./ExperienceList";
import { Typography, Divider } from "antd";
import Error404 from "../../components/error404/Error404";
import Loading from "../../components/loading/Loading";
import Title from "../../components/Title";
const { Text } = Typography;
function MemberDetails() {
  const [memberDetails, setMemberDetails] = useState({
    github: "",
    linkedin: "",
    specialties: [],
    alias_experiences: "Experiences",
    alias_skill: "Skills",
  });
  const [selectedMenu, setSelectedMenu] = useState("cardAbout");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { memberId } = useParams();
  // Refs to titles and content sections
  const contentRefs = useRef([]);

  function TextWithLineBreaks({ text = "" }) {
    if (text === null) {
      text = "";
    }

    // Split the text by newlines and map to an array of JSX elements
    const paragraphs = text.split(/\r\n/g).map((line, index, array) => (
      // Only add the <br> element if it's not the last line
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));

    return <p>{paragraphs}</p>;
  }

  const scrollToSection = (index) => {
    const contentTop = contentRefs.current[index].offsetTop;

    window.scrollTo({
      top: contentTop + contentRefs.current[4].offsetHeight,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    // Replace with actual API call using memberId to fetch member details

    fetch(`/api/members/${memberId}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error === 4) {
          setError(true);
          return;
        }
        data = data.info;
        let specialties = data.specialties ?? "";
        data.specialties =
          specialties === "" ? [] : data.specialties.split(",");

        data.alias_experiences =
          data.alias_experiences === ""
            ? "Experiences"
            : data.alias_experiences;
        data.alias_skill =
          data.alias_skill === "" ? "Skills" : data.alias_skill;
        data = { ...{ github: "", linkedin: "", specialties: [] }, ...data };

        setMemberDetails(data);
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [memberId]);

  if (isLoading === true) {
    return <Loading></Loading>;
  }

  if (error) {
    return <Error404 />;
  }

  return (
    <div className={styles.container}>
      <Title>{memberDetails.name + " " + memberDetails.family}</Title>
      <Bubbles></Bubbles>
      <div className={styles.mainHolder + " cv-with-column"}>
        <header className={styles.holdermenu + " rounded "}>
          <div
            onClick={() => {
              setSelectedMenu("cardAbout");
              scrollToSection(0);
            }}
            className={`${styles.btnMenu} ${
              selectedMenu === "cardAbout" ? styles.selected : ""
            } d-flex flex-column justify-content-center align-items-center`}
          >
            <FontAwesomeIcon
              className={"m-2 " + styles.iconBtnMenu}
              icon={faUser}
            />
            <span className={styles.titleBtnMenu}>ABOUT</span>
          </div>
          {memberDetails.skills && memberDetails.skills.trim() !== "" && (
            <div
              onClick={() => {
                setSelectedMenu("cardSkills");
                scrollToSection(1);
              }}
              className={`${styles.btnMenu} ${
                selectedMenu === "cardSkills" ? styles.selected : ""
              } d-flex flex-column justify-content-center align-items-center `}
            >
              <SettingOutlined className={"m-2 " + styles.iconBtnMenu} />
              <span className={styles.titleBtnMenu}>
                {memberDetails.alias_skill}
              </span>
            </div>
          )}
          {memberDetails.experience_count !== 0 && (
            <div
              onClick={() => {
                setSelectedMenu("cardExperience");
                scrollToSection(2);
              }}
              className={`${styles.btnMenu} ${
                selectedMenu === "cardExperience" ? styles.selected : ""
              } d-flex flex-column justify-content-center align-items-center `}
            >
              <FundProjectionScreenOutlined
                className={"m-2 " + styles.iconBtnMenu}
              />
              <span className={styles.titleBtnMenu}>
                {memberDetails.alias_experiences}
              </span>
            </div>
          )}
        </header>
        <div
          ref={(el) => (contentRefs.current[4] = el)}
          className={styles.banner + " rounded"}
        >
          <div className={styles.bannerBackground + " rounded"}></div>
          <div className={styles.bannerDetails + " rounded"}>
            <div
              className={styles.profileImg}
              style={{ backgroundImage: `url(/api/members/img/${memberId})` }}
            ></div>
            <div className={styles.holderNameAndJob + " "}>
              <div className={styles.holderRealativeNameAndJob}>
                <div
                  className={
                    styles.holderTextInNameAndJob +
                    " d-flex flex-column justify-content-center align-items-center "
                  }
                >
                  <label className={styles.name}>
                    {memberDetails.name + " " + memberDetails.family}
                  </label>
                  {memberDetails.specialties.length !== 0 && (
                    <label className={styles.specialties}>
                      <TypingAnimation
                        words={memberDetails.specialties}
                      ></TypingAnimation>
                    </label>
                  )}
                  <div
                    className={
                      styles.holderSocialMedia + " d-flex flex-column mt-1"
                    }
                  >
                    <Divider
                      className={"m-0 "}
                      orientation="left"
                      plain
                      orientationMargin="0"
                    >
                      <small className={"text-muted"}>Contact</small>
                    </Divider>
                    {memberDetails.email !== "" && (
                      <Text>
                        <FontAwesomeIcon
                          size="1x"
                          className="me-1"
                          icon={faEnvelope}
                        />
                        {memberDetails.email}
                      </Text>
                    )}
                    {memberDetails.github!== null && memberDetails.github !== "" && (
                      <a
                        rel="noreferrer"
                        target="_blank"
                        href={"https://github.com/" + memberDetails.github}
                      >
                        <FontAwesomeIcon
                          size="1x"
                          className="me-1"
                          icon={faGithub}
                        />
                        {memberDetails.github}
                      </a>
                    )}
                    {memberDetails.linkedin!== null && memberDetails.linkedin !== "" && (
                      <a
                        rel="noreferrer"
                        target="_blank"
                        href={
                          "https://www.linkedin.com/in/" +
                          memberDetails.linkedin
                        }
                      >
                        <FontAwesomeIcon
                          size="1x"
                          className="me-1"
                          icon={faLinkedin}
                        />
                        {memberDetails.linkedin}
                      </a>
                    )}
                  </div>
                </div>
                {memberDetails.cv && (
                  <a href={`/api/members/downloadCv/${memberDetails.id}`}>
                    <div
                      className={
                        styles.holderDownload +
                        " d-flex flex-row justify-content-center align-items-center "
                      }
                    >
                      <label>DOWNLOAD CV</label>
                      <FontAwesomeIcon
                        size="1x"
                        className="m-2"
                        icon={faDownload}
                      />
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardRealtive}>
            <div
              id="cardAbout"
              ref={(el) => (contentRefs.current[0] = el)}
              className={
                styles.EachPartOFMenu +
                " " +
                (selectedMenu === "cardAbout"
                  ? styles.EachPartOFMenuSelected
                  : "")
              }
            >
              <h2 className={styles.titleCard}>About</h2>
              <hr></hr>
              {TextWithLineBreaks({ text: memberDetails.about })}
            </div>
            {memberDetails.skills && memberDetails.skills.trim() !== "" && (
              <div
                id="cardSkills"
                ref={(el) => (contentRefs.current[1] = el)}
                className={
                  styles.EachPartOFMenu +
                  " " +
                  (selectedMenu === "cardSkills"
                    ? styles.EachPartOFMenuSelected
                    : "")
                }
              >
                <h2 className={styles.titleCard}>Skills</h2>
                <hr></hr>
                {TextWithLineBreaks({ text: memberDetails.skills })}
              </div>
            )}
            {memberDetails.experience_count !== 0 && (
              <div
                id="cardExperience"
                ref={(el) => (contentRefs.current[2] = el)}
                className={
                  styles.EachPartOFMenu +
                  " " +
                  (selectedMenu === "cardExperience"
                    ? styles.EachPartOFMenuSelected
                    : "")
                }
              >
                <h2 className={styles.titleCard}>Experience</h2>
                <hr></hr>
                <ExperienceList memberId={memberId}></ExperienceList>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDetails;
