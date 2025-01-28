import React from "react";
import { Form, Input, Row, Col } from "antd";
import Formsend from "../../../../components/Formsend";
const ProfileForm = ({ dataForm }) => {
  return (
    <Formsend
      url={"/dashboard/updateAbout"}
      dataForm={dataForm}
      titleBtn="Submit About"
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="about" label="About">
            <Input.TextArea rows={15} showCount maxLength={2000} allowClear />
          </Form.Item>
        </Col>
      </Row>
    </Formsend>
  );
};

export default ProfileForm;
