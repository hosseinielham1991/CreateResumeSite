import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Button } from "antd";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { UserContext } from "../../App";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/infoSlice";
import styles from "./LoginPage.module.css";
import Title from "../../components/Title";

const LoginPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { setUserInfo } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (event) => {
    try {
      await axiosInstance
        .post("/api/login", { username, password })
        .then(function (res) {
          if (res.data.success) {
            setUserInfo({ ...res.data.info, login: true });
            dispatch(setUser({ ...res.data.info, login: true }));
            setLoggedIn(true);
          } else {
            setError("Invalid username or password.");
          }
        })
        .catch(function (err) {
          console.error(err);
          setError("Error occurred while logging in. Please try again later.");
        });
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard/index/");
    }
    const params = new URLSearchParams(location.search);
    const usernameParam = params.get("username");
    if (usernameParam) {
      setUsername(usernameParam);
    }

    form.setFieldsValue({ username: usernameParam });
  }, [isLoggedIn, navigate, location.search, form]);

  return (
    <div className={styles.page}>
      <Title>Login</Title>
      <div className={styles.box}>
        <div className={styles.illustrationwrapper}>
          <img src="login.jpg" className={styles.illustration} alt="Login" />
        </div>
        <Form
          form={form}
          name="login-form"
          className={styles.form}
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
        >
          <p className={styles.formtitle}>Welcome back</p>
          <p>Login to the Dashboard</p>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              placeholder="Username"
              value={"kkkk"}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
            validateStatus={error && "error"}
            help={error && error}
          >
            <Input.Password
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Link to={"/forgotpassword"}>
            <label className="mb-2">Forgot password?</label>
          </Link>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.formbutton}
            >
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
