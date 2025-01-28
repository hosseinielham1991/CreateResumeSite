import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Input, Row, Col, Form, DatePicker, Divider } from "antd";
import styles from "./ExperienceEdit.module.css";
import Formsend from "../../../components/Formsend";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { setTimezone } from "../../../utils/tools";
import CropImage from "../../../components/cropimage/CropImage";
import CustomSkeleton from "../../../components/CustomSkeleton";
const ExperienceEdit = () => {
  const navigate = useNavigate();
  const { experienceId } = useParams();
  const [infoExperience, setInfoExperience] = new useState({});
  const [img, setImg] = useState("");

  useEffect(() => {
    const getinfo = async () => {
      let result = await axiosInstance.get(
        "/api/dashboard/experience/" + experienceId
      );

      setInfoExperience({
        ...result.data.info,
        ...{
          datecreate:
            (result.data.info.datecreate ?? "") !== ""
              ? dayjs(
                  setTimezone({ date: result.data.info.datecreate }),
                  "YYYY-MM-DD"
                )
              : "",
        },
      });

      setImg(result.data.info.img);
    };

    if (experienceId !== "0") getinfo();
    else {
      setInfoExperience({
        id: 0,
        title: "",
        summary: "",
        datecreate: "",
        link: "",
        img: "",
      });
      setImg("");
    }
  }, [experienceId, setInfoExperience]);

  const onsaveImage = ({ img }) => {
    setImg(img);
  };
  const onBeforeSubmitFormSend = ({ values }) => {
    values.img = img || "";
    return values;
  };

  const onCompleteSubmit = () => {
    navigate("/dashboard/index?tab=Experience");
  };

  if (infoExperience.id === undefined)
    return (
      <>
        <Divider></Divider>
        <CustomSkeleton
          plane={[
            { type: "Image", count: 1, align: "center" },
            { type: "Input", count: 1, two_column: false },
            { type: "Input", count: 1, two_column: true },
            { type: "Input", count: 1, two_column: false },
          ]}
        ></CustomSkeleton>
      </>
    );

  return (
    <Formsend
      onCompleteSubmit={onCompleteSubmit}
      onBeforeSubmit={onBeforeSubmitFormSend}
      url={"/dashboard/updateExperience/" + infoExperience.id}
      dataForm={infoExperience}
      titleBtn="Save"
    >
      <Divider orientation="left" plain orientationMargin="0">
        <Link to="/dashboard/index?tab=Experience">
          <label title="Back" onClick={() => {}}>
            <ArrowLeftOutlined className={styles.backIcon} />
          </label>
        </Link>
        <label className={styles.titleEdit + " ms-2"}>
          {experienceId !== "0" ? infoExperience.title : "Add New Experience"}
        </label>
      </Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24}>
          {}
          <CropImage
            onsave={onsaveImage}
            size={'auto'}
            circle={false}
            hasValue={false}
            viewUrl={"/api/members/Experience/img/" + infoExperience.id}
            saveUrl={"/dashboard/uploadImageTemp"}
            viewUrlAfterSave={"/api/dashboard/viewImageTemp/"}
            title={infoExperience.title}
          >
            <CropImage.View alt={infoExperience.id}></CropImage.View>
          </CropImage>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24}>
          {}
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please input your Title!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Form.Item name="datecreate" label="Date Create">
            <DatePicker className="w-100" format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="link" label="Link">
            <Input />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="summary" label="Summary">
            <Input.TextArea rows={5} showCount maxLength={1000} allowClear />
          </Form.Item>
        </Col>
      </Row>
    </Formsend>
  );
};

export default ExperienceEdit;
