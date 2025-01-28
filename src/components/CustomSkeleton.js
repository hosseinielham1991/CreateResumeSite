import React from "react";
import { Skeleton, Row, Col } from "antd";

const CustomSkeleton = ({ plane = [] }) => {
  const size = true;
  const block = true;

  const CustomSkeleton = (
    <>
      {plane.map((component, index) => {
        const Component = Skeleton[component.type]; // Dynamically access the Skeleton component
        component.two_column = component.two_column ?? false;
        const col_size = component.two_column ? [24, 12] : [24, 24];
        const class_name =
          component.align === "center"
            ? "d-flex flex-row justify-content-center align-items-center"
            : "";

        return (
          <Row
            key={component.key + "_" + index}
            gutter={[16, 16]}
            className={"mb-2 " + class_name}
          >
            {Array.from({ length: component.count }, (_, index) => index).map(
              (counter) => {
                return (
                  <React.Fragment key={"col1_" + counter}>
                    <Col
                      className={class_name}
                      xs={col_size[0]}
                      sm={col_size[1]}
                    >
                      <Component active={true} size={size} block={block} />
                    </Col>
                    {component.two_column && (
                      <Col
                        className={class_name}
                        xs={col_size[0]}
                        sm={col_size[1]}
                      >
                        <Component active={true} size={size} block={block} />
                      </Col>
                    )}
                  </React.Fragment>
                );
              }
            )}
          </Row>
        );
      })}
    </>
  );

  return <>{CustomSkeleton}</>;
};

export default CustomSkeleton;
