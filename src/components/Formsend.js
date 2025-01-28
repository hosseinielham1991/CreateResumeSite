import React, { useEffect, useState } from "react";
import { Form, message, Button, Row, Col } from "antd";
import axiosInstance from "../utils/axiosInstance";

const Formsend = ({
  formRef,
  button = true,
  children,
  titleBtn = "Save",
  beforeStartSend,
  onBeforeSubmit,
  onError,
  onCompleteSubmit,
  dataForm,
  autoComplete = "off",
  url,
  layout = "vertical",
  labelCol = {},
  wrapperCol = {},
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  let settime = -1;

  useEffect(() => {
    if (dataForm) {
      form.setFieldsValue(dataForm);
    }
  }, [dataForm, form]);

  message.config({
    duration: 2,
    maxCount: 1,
  });

  const onFinish = async (values) => {
    if (beforeStartSend) beforeStartSend();

    settime = setTimeout(() => {
      setLoading(true);
    }, 1000);

    const formdata = new FormData();

    if (onBeforeSubmit) values = onBeforeSubmit({ values });

    Object.entries(values).map((item) => {
      item[1] = item[1] === null ? "" : item[1];
      formdata.append(item[0], item[1]);
      return item;
    });

 
    try {
      messageApi.open({
        type: "loading",
        content: "sending form...",
        key: "sendform_message",
      });
      await axiosInstance
        .post("/api" + url, formdata)
        .then(() => {
          setLoading(false);
          messageApi.open({
            type: "success",
            content: "your data is updated!",
            key: "sendform_message",
          });
        })
        .catch((reslut) => {
          if (onError) onError({ data: reslut.response.data });
          messageApi.open({
            type: "error",
            content: `your data is'not updated!`,
            key: "sendform_message",
          });
        })
        .finally(async () => {
          if (settime !== -1) {
            clearTimeout(settime);
            settime = -1;
          }

          setLoading(false);

          if (onCompleteSubmit) {
            onCompleteSubmit({ values });
          }
        });

      // Additional success handling
    } catch (error) {
      console.error(error);
      // Additional error handling
    }
  };

  // Recursively traverse children and set disabled prop on form fields
  const mapChildren = (children) => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        if (
          child.props &&
          child.props.children &&
          child.type.displayName !== "Select"
        ) {
          // If child has children, recursively map them
          return React.cloneElement(child, {
            children: mapChildren(child.props.children),
          });
        } else if (
          (child.type.displayName ?? "Input") === "Input" ||
          (child.type &&
            ["Input", "Select", "DatePicker"].includes(child.type.displayName))
        ) {
          return React.cloneElement(child, { disabled: loading });
        }
      }
      return child;
    });
  };

  return (
    <Form
      form={form}
      layout={layout}
      onFinish={onFinish}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      autoComplete={autoComplete}
      ref={formRef}
    >
      {contextHolder}
      {mapChildren(children)}
      {button && (
        <Row gutter={16}>
          <Col span={24}>
            <Button type="primary" htmlType="submit">
              {loading ? "Loading..." : titleBtn}
            </Button>
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default Formsend;
