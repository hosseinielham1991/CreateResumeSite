import React, { useState, useRef, useEffect } from "react";
import styles from "./Box.module.css";
import { Modal } from "antd";

const Box = ({
  id,
  title,
  summary,
  more = 1,
  description = "",
  link = "",
  summary_center = 0,
  urlimg,
  eventsShowMore,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [contentModal, setContentModal] = useState(null);
  const [urlImage, setUrlImage] = useState("");
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      let timecount = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting === true) {
          setTimeout(() => {
            setUrlImage("/api/members" + urlimg + id);
          }, timecount);
          timecount += 500;
        }
        setIsVisible(entry.isIntersecting);
      });
    });

    const { current } = domRef;
    observer.observe(current);

    // Optional: clean up the observer when the component unmounts
    return () => observer.unobserve(current);
  }, [urlimg, id]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleClose = () => {
    setIsModalVisible(false);
  };
  const showModal = async () => {
    const jsxFromParent = await eventsShowMore({ id: id });
    setContentModal(jsxFromParent);
    setIsModalVisible(true);
  };

  const TitleComponent = link ? (
    <a
      target="_blank"
      rel="noreferrer"
      href={link}
      className={styles.experienceTitleLink}
    >
      <label className={styles.experienceTitle + ' m-0 mt-2 '}>{title}</label>
    </a>
  ) : (
    <label className={styles.experienceTitle+' m-0 mt-2 '}>{title}</label>
  );

  return (
    <div
      className={
        styles.eachExperience +
        " " +
        styles.fadeInSection +
        " col-12 " +
        (isVisible ? styles.isVisible : "")
      }
      ref={domRef}
    >
      <div className={styles.experienceCard}>
        <div className={styles.holdeEachBox}>
          <img src={urlImage} alt={title} className={styles.holderImg} />
        </div>
        <div className={styles.experienceDetails}>
          {TitleComponent}
          <p
            className={
              styles.experienceSummary +
              (summary_center === 1 ? " text-center" : "")
            }
          >
            {summary}
          </p>
          {more && (
            <label
              onClick={() => {
                showModal();
              }}
              alt=""
              className={styles.showMoreButton}
            >
              More
            </label>
          )}
        </div>
      </div>
      <Modal
        title={title}
        open={isModalVisible}
        onCancel={handleClose}
        width={1000}
        footer={null}
        style={{ top: 20 }}
      >
        <hr style={{ marginBottom: "5px" }}></hr>
        {contentModal}
      </Modal>
    </div>
  );
};

export default Box;
