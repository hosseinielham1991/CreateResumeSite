import React, { useState } from "react";
import { Button, Modal, Divider, Form, Input, notification } from "antd";
import { useSelector } from "react-redux";
import axiosInstance from "../../../utils/axiosInstance";

const Privacy = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const userinfo = useSelector((state) => state.public.userinfo);
  const [form] = Form.useForm();

  const openNotification = ({ message, type }) => {
    api[type]({
      message: `Message `,
      description: message,
      placement: "topLeft",
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onFinish(values);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  const onFinish = async (values) => {
    // Logic to handle form submission
    setIsLoading(true);
    await axiosInstance
      .post("/api/dashboard/changepassword", values)
      .then(() => {
        openNotification({
          type: "success",
          message: "Password changed successfully",
        });
      })
      .catch(() => {
        openNotification({
          type: "error",
          message: "There was a problem changing the password",
        });
      })
      .finally(() => {
        setIsLoading(false);
        form.resetFields();
        setIsModalOpen(false);
      });
  };

  return (
    <>
      {contextHolder}
      <Button onClick={showModal} className="mt-2" block>
        Change password
      </Button>
      <Modal
        title="Private Setting"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ margin: "15px 0" }}
        centered={true}
        maskClosable={false}
        autoComplete={"off"}
        footer={[
          <Button key="btn_cancel" className="" type="default">
            Cancel
          </Button>,
          <Button
            onClick={handleSubmit}
            key="btn_Save"
            className=""
            type="primary"
          >
            Save
          </Button>,
        ]}
      >
        <Divider />
        <Form
          layout="horizontal"
          onFinish={onFinish}
          form={form}
          labelCol={{
            span: 7,
          }}
          wrapperCol={{
            span: 17,
          }}
        >
          <Form.Item label="Username">
            <Input value={userinfo.username} disabled />
          </Form.Item>

          <Form.Item
            label="New password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your new password!",
              },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message:
                  "Password must contain at least one letter and one number!",
              },
            ]}
          >
            <Input.Password disabled={isLoading} autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            label="Confirm password"
            name="confirmpassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please repeat your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password disabled={isLoading} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Privacy;
