import React, { useEffect, useState } from "react";
import api from "../../../../../utils/api";
import { Table, Button, Popconfirm, message, Badge } from "antd";
import styles from "./Experience.module.css";
import {
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomSkeleton from "../../../../../components/CustomSkeleton";
import { PlusOutlined } from "@ant-design/icons";
import axiosInstance from "../../../../../utils/axiosInstance";

const Experience = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const userinfo = useSelector((state) => state.public.userinfo);
  const [experienceData, setExperienceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  message.config({
    duration: 2,
    maxCount: 1,
  });

  useEffect(() => {
    const getinfo = async () => {
      setLoading(true);
      let listExperience = await api.fetchExperiences({
        memberId: userinfo.id,
      });
      setExperienceData(listExperience);
      setLoading(false);
    };
    getinfo();
  }, [userinfo.id]);

  const clickOnDelete = async ({ experience_id }) => {
    messageApi.open({
      type: "loading",
      content: "Deleting!!!",
      key: "delete_row",
    });
    await axiosInstance
      .get("/api/dashboard/experience/delete/" + experience_id)
      .then((res) => {
        if (res.data.message === "deleted") {
          messageApi.open({
            type: "success",
            content: "The item was deleted",
            key: "delete_row",
          });

          setExperienceData(
            experienceData.filter((item) => item.id !== experience_id)
          );
        } else {
          messageApi.open({
            type: "error",
            content: "The delete operation failed.",
            key: "delete_row",
          });
        }
      });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "30%",
      className: " text-nowrap ",
      render: (_, record) => {
        return (
          <>
            <img
              className={styles.imageView + " me-2  "}
              src={`/api/members/Experience/img/${record.id}?v=${record.img}`}
              alt={record.title}
            />
            <label>{record.title}</label>
          </>
        );
      },
      // ...getColumnSearchProps('title'),
    },
    {
      title: "Summary",
      dataIndex: "summary",
      key: "summary",
      className: styles.columnSummary,
      // ...getColumnSearchProps('age'),
    },
    {
      title: "Link",
      dataIndex: "link",
      render: (href) => (
        <a target="_blank" href="href">
          {href}
        </a>
      ),
      key: "link",
      //...getColumnSearchProps('address')
    },
    {
      title: "Date",
      dataIndex: "datecreate",
      key: "link",
      //...getColumnSearchProps('address')
    },
    {
      title: "Action",
      dataIndex: "action",
      className: styles.columnAction,
      render: (_, record, index) => (
        <div>
          <Popconfirm
            key="btn_delete_popconfirm"
            title="Delete"
            description="If you delete this experience, all details about it will also be deleted. are you sure?"
            onConfirm={() => {
              clickOnDelete({ experience_id: record.id });
            }}
            okType="danger"
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined className="p-2 text-danger" />
          </Popconfirm>
          <Link
            className="p-2 "
            to={`/dashboard/index/experience/details/${record.id}/${record.title}`}
          >
            <Badge
              count={record.detailsCount}
              color="var(--primary-color)"
              size="small"
            >
              <FileAddOutlined className=" " />
            </Badge>
          </Link>
          <Link to={"/dashboard/index/experience/" + record.id}>
            <EditOutlined className="p-2 ms-1 " />
          </Link>
        </div>
      ),
      key: "link",
      fixed: "right",
      //...getColumnSearchProps('address')
    },
  ];

  const handleTableChange = (pagination) => {
    // Update pagination state when pagination changes
    setPagination(pagination);
  };

  if (loading)
    return (
      <>
        <CustomSkeleton
          plane={[{ type: "Input", count: 10, two_column: false }]}
        ></CustomSkeleton>
      </>
    );

  return (
    <>
      {contextHolder}
      <Link to={"/dashboard/index/experience/0"}>
        <Button icon={<PlusOutlined />} type="primary" className="mb-2">
          Add New Experience
        </Button>
      </Link>
      <Table
        pagination={pagination}
        onChange={handleTableChange}
        columns={columns}
        dataSource={experienceData}
      />
    </>
  );
};

export default Experience;
