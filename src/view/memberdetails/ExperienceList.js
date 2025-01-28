import React, { useState, useEffect } from "react";
import Box from "../../components/box/Box";
import api from "../../utils/api";

const ExperienceList = ({ memberId }) => {
  const [experiences, setExperiences] = useState([]);
  const [columnExperience, setColumnExperience] = useState(3);
  const [columnComponent, setColumnComponent] = useState(3);

  useEffect(() => {
    ////////////////////////////////////////////////////////

    const getinfo = async () => {
      let listExperience = await api.fetchExperiences({
        multiColumn: true,
        memberId,
        column: columnExperience,
      });
      setExperiences(listExperience);
    };
    getinfo(columnExperience);

    ////////////////////////////////////////////////////////
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mediaQueryExperience = [
      window.matchMedia("(min-width: 900px) and (max-width: 1268px)"),
      window.matchMedia("(min-width: 550px) and (max-width: 700px)"),
    ];
    const mediaQueryComponent = window.matchMedia("(min-width: 800px)");
    const handleMediaQueryChange = () => {
      if (mediaQueryExperience[0].matches) {
        setColumnExperience(4);
      } else if (mediaQueryExperience[1].matches) {
        setColumnExperience(2);
      } else {
        setColumnExperience(3);
      }

      if (mediaQueryComponent.matches) {
        setColumnComponent(3);
      } else {
        setColumnComponent(2);
      }
    };
    handleMediaQueryChange();
    // Listen for changes
    window.addEventListener("resize", handleMediaQueryChange);

    return () => {
      window.removeEventListener("resize", handleMediaQueryChange);
    };
  }, [memberId, columnExperience, columnComponent]); // Add memberId as a dependency

  const renderComponents = ({ listComponent, key }) => {
    const col = 12 / columnComponent;
    return (
      <div
        className={`col-sm-${col} col-12`}
        key={`${key}_each_row_components`}
      >
        {listComponent.map((component, index) => (
          <React.Fragment key={component.id}>
            <Box
              id={component.id}
              title={component.title}
              summary={component.description}
              more={false}
              urlimg="/Experience/details/img/"
            />
          </React.Fragment>
        ))}
      </div>
    );
  };

  const beforeShowModal = async ({ id }) => {
    let seperateComponents = await api.fetchExperiencesDetails({
      multiColumn: true,
      experienceId: id,
      column: columnComponent,
    });
    return (
      <div className="row">
        {seperateComponents.map((listComponent, index) => {
          return renderComponents({ listComponent, key: index });
        })}
      </div>
    );
  };

  // Consolidate repetitive JSX structure. Receives 'left' or 'right'.
  const renderExperienceColumn = ({ Experience, key }) => {
    const col = 12 / columnExperience;
    return (
      <div
        className={`col-sm-${col} col-12`}
        key={`${key}_each_row_experience`}
      >
        <div className="row">
          {Experience.map((item) => (
            <React.Fragment key={item.id}>
              <Box
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                summary={item.summary}
                more={item.detailsCount !== 0}
                urlimg="/Experience/img/"
                link={item.link}
                eventsShowMore={beforeShowModal}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={"row"} onScroll={() => {}}>
      {experiences.map((Experience, index) => {
        return renderExperienceColumn({ Experience, key: index });
      })}
    </div>
  );
};

export default ExperienceList;
