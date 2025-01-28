import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Button, Row, Col, Typography } from "antd";
import axiosInstance from "../../utils/axiosInstance";
import styles from "./ForgotpasswordPage.module.css"; // Import CSS module
import { useNavigate } from "react-router-dom";
import Title from "../../components/Title";
const { Text } = Typography;
const sendCode = async ({ email }) => {
  const res = axiosInstance.post("/api/signup/sendcode", { email: email });
  return res;
};

const ForgotpasswordPage = () => {
  const time_of_expire = 10;
  const [step, setStep] = useState("check_email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [infoEmail, setInfoEmail] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([...Array(6)].map(() => React.createRef())); // Create refs for each input
  const [timer, setTimer] = useState(time_of_expire); // 120 seconds = 2 minutes
  const [passwordConfirmVisible, setPasswordConfirmVisible] =
    React.useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {}, []);

  const info_each_step = {
    check_email: {
      btn: "Continue",
      title: "Forgot password",
      description:
        "We’ll send a verification code to this email if it matches an existing account.",
    },
    send_code: {
      btn: "Confirm",
      title: "Verification Code",
      description: "Verify your email with the code we sent.",
    },
    get_pass: {
      btn: "Confirm",
      title: "New Password",
      description: "Set new password.",
    },
    done: {
      btn: "Sign in",
      title: "Password changed successfully.",
      description: "Please try to log in again",
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
      if (step === "done") {
        navigate("/login");
      }

      await axiosInstance
        .post("/api/signup/checkingForgotpassword", {
          step,
          email,
          code: code.join(""),
          password: values.password,
        })
        .then(async function (res) {
          const info = res.data.info;

          switch (step) {
            case "check_email": {
              if (info.email === false) {
                setInfoEmail("There is no account with this email");
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
              if (info.code === false) {
                setErrorCode("The entered code is incorrect.");
                return;
              }
              setStep("get_pass");

              break;
            }
            case "get_pass": {
              if (res.data.message === "done") {
                setStep("done");
                return;
              }

              break;
            }
            default:
          }
        })
        .catch(function (err) {});
    } catch (error) {
      console.error("change password failed", error);
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
      <Title>forgot password</Title>

      <div className={styles.box}>
        <div className={styles.illustrationWrapper}>
          <img src="forgotpassword.jpg" alt="forgotpassword" />
        </div>
        <Form
          name="forgotpassword-form"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          validateMessages={validateMessages}
          className={styles.form}
        >
          <p className={styles.formTitle}>{info_each_step[step].title}</p>
          <p className="mb-4">{info_each_step[step].description}</p>
          {step === "check_email" && (
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
          {step === "get_pass" && (
            <span>
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
                  placeholder="new password"
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
                  placeholder="confirm new password"
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

export default ForgotpasswordPage;
