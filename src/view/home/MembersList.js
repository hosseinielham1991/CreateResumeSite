import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./MembersList.module.css";
import Box from "../../components/box/Box";
import Title from "../../components/Title";
function MembersList() {
  const [members, setMembers] = useState([]);
  // Manage the 'from' state with useState
  const scrollFinish = useRef(false);
  const lockRef = useRef(false);
  let from = useRef(0);

  const getListInScroll = async () => {
    if (lockRef.current) {
      return;
    }
    lockRef.current = true;
    try {
      const response = await fetch(
        `/api/members/getmembers?from=${from.current}&count=12`
      );
      const data = await response.json();

      from.current = data.info.from; // Update 'from' state
      setMembers((prevMembers) => [...prevMembers, ...data.info.list]); // Use functional update for 'members' state

      if (data.info.list.length < 10) {
        scrollFinish.current = true;
      }
    } catch (error) {
      console.error(error);
    } finally {
      lockRef.current = false;
    }
  };

  const handleScroll = useCallback(() => {
    if (
      !lockRef.current &&
      document.documentElement.scrollHeight -
        window.innerHeight -
        document.documentElement.scrollTop <
        50 &&
      !scrollFinish.current
    ) {
      getListInScroll();
    }
  }, []); // Removed 'from' dependency to avoid adding new event listeners

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    getListInScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup the event listener
    };
  }, [handleScroll]); // Added 'handleScroll' dependency

  return (
    <>
      <Title>Home</Title>
      <div className={styles.holderbanner}>
        <picture>
          {/* For screens with max-width 600px */}
          <source
            media="(max-width: 600px)"
            srcSet="/bannerx.png"
          />

          {/* For screens between 600px and 900px */}
          <source
            media="(min-width: 601px) and (max-width: 900px)"
            srcSet="/bannerM.png"
          />

          {/* For screens with min-width 900px */}
          <source
            media="(min-width: 901px)"
            srcSet="/bannerL.png"
          />

          <img className={styles.banner} alt="CVisionary" src="/bannerL.png" />
        </picture>
      </div>
      <div className="container ">
        <div className={styles.holderListMembers}>
          <div className="row">
            {members.map((member) => (
              <div
                className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12"
                key={member.id}
              >
                <Link to={"/members/" + member.id}>
                  <Box
                    key={member.id}
                    id={member.id}
                    title={member.name + " " + member.family}
                    urlimg="/img/"
                    more={false}
                    summary_center={1}
                    summary={member.title === "" ? " " : member.title}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default MembersList;
