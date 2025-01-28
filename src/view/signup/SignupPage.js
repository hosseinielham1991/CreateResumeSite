import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Button, Row, Col, Typography } from "antd";
import axiosInstance from "../../utils/axiosInstance";
import styles from "./SignupPage.module.css"; // Import CSS module
import { useNavigate } from "react-router-dom";
import Title from "../../components/Title";
const { Text } = Typography;
const sendCode = async ({ email }) => {
  const res = axiosInstance.post("/api/signup/sendcode", { email: email });
  return res;
};
let add = false;

const SignupPage = () => {
  const navigate = useNavigate();

  const time_of_expire = 10;
  const [step, setStep] = useState("get_email");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [infoEmail, setInfoEmail] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([...Array(6)].map(() => React.createRef())); // Create refs for each input
  const [timer, setTimer] = useState(time_of_expire); // 120 seconds = 2 minutes
  const [passwordConfirmVisible, setPasswordConfirmVisible] =
    React.useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  useEffect(() => {}, []);

  const info_each_step = {
    get_email: {
      btn: "Continue",
      title: "Join us",
      description: "We are happy to have you as a member",
    },
    send_code: {
      btn: "Confirm",
      title: "Verification Code",
      description: "Verify your email with the code we sent.",
    },
    get_user_pass: {
      btn: "Sign up",
      title: "Create Your Account",
      description: "Set up your username and password.",
    },
  };

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: "${label} is required!",
    types: {
      // eslint-disable-next-line no-template-curly-in-string
      email: "${label} is not a valid email!",
      // eslint-disable-next-line no-template-curly-in-string
      number: "${label} is not a valid number!",
    },
    number: {
      // eslint-disable-next-line no-template-curly-in-string
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const handleSubmit = async (values) => {
    try {
      await axiosInstance
        .post("/api/signup/checkingSignup", {
          add,
          email,
          code: code.join(""),
          username,
          name: values.name,
          family: values.family,
          password: values.password,
        })
        .then(async function (res) {
          const validate = res.data.info;

          add = false;

          switch (step) {
            case "get_email": {
              setErrorEmail(validate.email.message);

              if (validate.email.status === false) {
                return;
              }

              setInfoEmail(
                "It may take some time to send the email. please wait..."
              );
              const res_send_code = await sendCode({ email });
              setInfoEmail("");

              if (res_send_code.data.error) {
                setErrorEmail(res_send_code.data.message);
                return;
              }

              setStep("send_code");
              startTimer({});

              break;
            }
            case "send_code": {
              if (validate.code === false) {
                setErrorCode("The entered code is incorrect.");
                return;
              }
              setStep("get_user_pass");
              add = true;
              break;
            }
            case "get_user_pass": {
              if (res.data.message === "Done") {
                navigate(`/login?username=${encodeURIComponent(username)}`);
                return;
              }

              if (validate.username.status === false) {
                setErrorUsername(validate.username.message);
                return;
              }

              break;
            }
            default:
          }
        })
        .catch(function (err) {});
    } catch (error) {
      console.error("signup failed", error);
    }
  };

  const handleKeyDown = (index, e) => {
    // Allow arrow keys navigation
    if (e.key === "ArrowRight" && index < 4) {
      inputsRef.current[index + 1].current.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1].current.focus();
    } else if (e.key === "Backspace" && index > 0 && code[index] === "") {
      // Handle backspace to remove value of previous input
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputsRef.current[index - 1].current.focus();
    }
  };

  const handleChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move focus to the next input field
    if (index < 5) {
      inputsRef.current[index + 1].current.focus();
    }
  };
  const handleFocus = (index) => {
    inputsRef.current[index].current.select(); // Select input value on focus
  };

  let timer_loop = time_of_expire;
  const startTimer = ({ just_start }) => {
    setTimer((prevTimer) => {
      if (prevTimer === 0) {
        if (just_start !== true) {
          timer_loop = 0;
          return 0;
        } else {
          timer_loop = time_of_expire;
          return time_of_expire;
        }
      } else {
        timer_loop = prevTimer - 1;
        return prevTimer - 1;
      }
    });

    if (timer_loop !== 0)
      setTimeout(() => {
        startTimer({});
      }, 1000);
  };

  const resendcode = async () => {
    setErrorCode("");
    const res_send_code = await sendCode({ email });

    if (res_send_code.data.error) {
      setErrorCode(res_send_code.data.message);
      return;
    }
    setErrorCode("");
    startTimer({ just_start: true });
  };
  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error("The two passwords that you entered do not match!")
      );
    },
  });

  return (
    <div className={styles.page}>
      <Title>Log in</Title>
      <div className={styles.box}>
        <div className={styles.illustrationWrapper}>
          <img src="signup.jpg" alt="signup" />
        </div>
        <Form
          name="signup-form"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          validateMessages={validateMessages}
          className={styles.form}
        >
          <p className={styles.formTitle}>{info_each_step[step].title}</p>
          <p className="mb-4">{info_each_step[step].description}</p>
          {step === "get_email" && (
            <span>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                  },
                  { required: true, message: "Please input your Email!" },
                ]}
                validateStatus={errorEmail !== "" ? "error" : undefined}
                help={
                  infoEmail !== ""
                    ? infoEmail
                    : errorEmail !== ""
                    ? errorEmail
                    : undefined
                }
                className={styles.formItem}
              >
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorEmail("");
                  }}
                  className={styles.input}
                />
              </Form.Item>
            </span>
          )}
          {step === "send_code" && (
            <>
              <Form.Item
                validateStatus={errorCode !== "" ? "error" : undefined}
                help={errorCode !== "" ? errorCode : undefined}
              >
                <Row gutter={16} justify="center">
                  {code.map((digit, index) => (
                    <Col key={index} xs={4} sm={4} md={4} lg={4} xl={4}>
                      <Input
                        className={styles.codeInput}
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        ref={inputsRef.current[index]}
                        onFocus={() => handleFocus(index)}
                      />
                    </Col>
                  ))}
                </Row>
              </Form.Item>
              <Row justify="center mb-2">
                <Col>
                  {timer > 0 ? (
                    <label className={styles.timerLabel}>
                      {Math.floor(timer / 60)
                        .toString()
                        .padStart(2, "0")}{" "}
                      : {timer % 60 < 10 ? "0" : ""}
                      {timer % 60}
                    </label>
                  ) : (
                    <Text className={styles.resendLink} onClick={resendcode}>
                      Resend Code
                    </Text>
                  )}
                </Col>
              </Row>
            </>
          )}
          {step === "get_user_pass" && (
            <span>
              <Form.Item
                name="name"
                rules={[
                  { required: true, message: "Please enter your firstname!" },
                ]}
                className={styles.formItem}
              >
                <Input
                  placeholder="firstname"
                  value={firstname}
                  onChange={(e) => {
                    setFirstname(e.target.value);
                  }}
                  className={styles.input}
                />
              </Form.Item>
              <Form.Item
                name="family"
                rules={[
                  { required: true, message: "Please enter your lastname!" },
                ]}
                className={styles.formItem}
              >
                <Input
                  placeholder="lastname"
                  value={lastname}
                  onChange={(e) => {
                    setLastname(e.target.value);
                  }}
                  className={styles.input}
                />
              </Form.Item>
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please enter your username!" },
                  {
                    min: 4,
                    message: "Username must be at least 8 characters long",
                  },
                ]}
                validateStatus={errorUsername !== "" ? "error" : undefined}
                help={errorUsername !== "" ? errorUsername : undefined}
                className={styles.formItem}
              >
                <Input
                  placeholder="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorUsername("");
                  }}
                  className={styles.input}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters long!",
                  },
                ]}
                className={styles.formItem}
              >
                <Input.Password
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  placeholder="password"
                  value={password}
                  className={styles.input}
                  visibilityToggle={{
                    visible: passwordVisible,
                    onVisibleChange: setPasswordVisible,
                  }}
                />
              </Form.Item>
              <Form.Item
                name="confirmpassword"
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password!",
                  },
                  validateConfirmPassword,
                ]}
                className={styles.formItem}
              >
                <Input.Password
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value);
                  }}
                  placeholder="confirm password"
                  value={passwordConfirm}
                  className={styles.input}
                  visibilityToggle={{
                    visible: passwordConfirmVisible,
                    onVisibleChange: setPasswordConfirmVisible,
                  }}
                />
              </Form.Item>
            </span>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.formButton}
            >
              {" "}
              {/* Use CSS module class */}
              {info_each_step[step].btn}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;
