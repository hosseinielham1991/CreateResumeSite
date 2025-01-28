import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Select,
  message,
  Space,
  Button,
  Divider,
  Typography 
} from "antd";
import Formsend from "../../../../components/Formsend";
import { countries } from "countries-list";

const { Option } = Select;
const { Text } = Typography;


const ProfileForm = ({ dataForm }) => {
  const [errorPath, setErrorPath] = useState("");
  const [path, setPath] = useState();

  const [messageApi, contextHolder] = message.useMessage();

  const countryOptions = Object.keys(countries).map((code) => ({
    code,
    name: countries[code].name,
  }));

  const checkMessageOfForm = ({ data }) => {
    if (data?.info?.exist_path !== undefined)
      setErrorPath("Another user has used this url");
  };

  const copycliboard = async () => {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const port = window.location.port;
    const currentBaseUrl = port
      ? `${protocol}//${host}:${port}/`
      : `${protocol}//${host}/`;

    await navigator.clipboard.writeText(currentBaseUrl + path);

    messageApi.open({
      type: "success",
      content: "The path was copied to clipboard. Now you can share it",
    });
  };

  useEffect(() => {
    setPath(dataForm.path);
  }, [dataForm]);

  return (
    <Formsend
      beforeStartSend={() => {
        setErrorPath("");
      }}
      url={"/dashboard/updateprofile"}
      onError={checkMessageOfForm}
      dataForm={dataForm}
      titleBtn="Submit Profile"
    >
      {contextHolder}
      <Row gutter={[16, 16]}>
        <Col span={24}>
        <Text strong>Email: {dataForm.email}</Text>
        </Col>
      </Row>
      <Divider
        style={{ color: "var(--primary-color)" }}
        orientation="left"
        orientationMargin="0"
      >
        * Personal Information
      </Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item
            name="family"
            label="Family"
            rules={[
              { required: true, message: "Please input your family name!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="age"
            label="Date of Birth"
            rules={[
              { required: true, message: "Please select your date of birth!" },
            ]}
          >
            <DatePicker className="w-100" format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="gender" label="Gender">
            <Select placeholder="Select gender">
              <Option value="Female">Female</Option>
              <Option value="Male">Male</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item name="job_position" label="Job position">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="specialties" label="Specialties">
            <Input placeholder="for example(separate by ,): Frontend Development, React, JavaScript, Next" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item name="country" label="Country">
            <Select placeholder="Select a country">
              {countryOptions.map((country) => (
                <Option key={country.code} value={country.code}>
                  {country.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item name="linkedin" label="Linkedin Link">
            <Input
              addonBefore="https://linkedin.com/in/"
              placeholder="username"
            />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12}>
          <Form.Item name="github" label="GitHub Link">
            <Input addonBefore="https://github.com/" placeholder="username" />
          </Form.Item>
        </Col>
      </Row>
      <Divider
        style={{ color: "var(--primary-color)" }}
        orientation="left"
        orientationMargin="0"
      >
        * Personalize settings
      </Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="alias_skill"
            label="The alias for the 'Skills' tab"
            rules={[{ max: 10, message: "Maximum 10 characters allowed." }]}
          >
            <Input placeholder="Skills" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="alias_experiences"
            label="The alias for the 'Experiences' tab"
            rules={[{ max: 10, message: "Maximum 10 characters allowed." }]}
          >
            <Input placeholder="Experiences" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24} className="mb-2">
          <label className="mb-2">public profile and url</label>
          <Space.Compact className="w-100">
            <Form.Item
              name="path"
              className="w-100 m-0"
              validateStatus={errorPath !== "" ? "error" : ""}
              help={errorPath !== "" && errorPath}
            >
              <Input
                addonBefore={"https://cvisionary.ir/"}
                value={path}
                onChange={(e) => {
                  setPath(e.target.value);
                }}
              />
            </Form.Item>
            <Button onClick={copycliboard}>Copy Path</Button>
          </Space.Compact>
          <small className="text-muted">
            You can share this URL with your friends and colleagues, and you can
            edit it.{" "}
          </small>
        </Col>
      </Row>
    </Formsend>
  );
};

export default ProfileForm;
