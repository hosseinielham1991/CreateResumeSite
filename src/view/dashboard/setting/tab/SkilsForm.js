import React from "react";
import { Form, Input, Row, Col } from "antd";
import Formsend from "../../../../components/Formsend";
const ProfileForm = ({ dataForm }) => {
  return (
    <Formsend
      url={"/dashboard/updateskills"}
      dataForm={dataForm}
      titleBtn="Submit Skills"
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="skills" label="Skills">
            <Input.TextArea rows={15} showCount maxLength={1000} allowClear />
          </Form.Item>
        </Col>
      </Row>
    </Formsend>
  );
};

export default ProfileForm;
