import { useEffect, useState, useRef, useCallback } from "react";
import api from "../../../utils/api";
import {
  Table,
  Divider,
  Modal,
  Button,
  Popconfirm,
  Row,
  Col,
  Input,
  Form,
  ConfigProvider,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import styles from "./ExperienceDetails.module.css";
import Formsend from "../../../components/Formsend";
import CropImage from "../../../components/cropimage/CropImage";
import CustomSkeleton from "../../../components/CustomSkeleton";
import axiosInstance from "../../../utils/axiosInstance";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ExperienceDetails = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { experienceId, experienceTitle } = useParams();
  const [loading, setLoading] = useState(true);
  const [experienceDetails, setExperienceDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExperienceDetails, setSelectedExperienceDetails] = useState(
    {}
  );
  const [img, setImg] = useState("");
  const formRef = useRef(null);
  const imageversion = Math.floor(Math.random() * 1000);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Define sensors inside the component
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  const onDragEnd = ({ active, over }) => {

    if (active.id !== over?.id) {
      setExperienceDetails((prev) => {

        const activeIndex = prev.find((i) => i.key === active.id);
        const overIndex = prev.find((i) => i.key === over?.id);


        axiosInstance
          .post("/api/dashboard/orderExperienceDetails/" + experienceId, {
            moveIndex: activeIndex.position,
            dropIndex: overIndex.position,
          })

        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const rowSelection = {
    selections: [
      {
        key: "delete",
        text: "Delete selected row ",
        onSelect: async () => {
          messageApi.open({
            type: "loading",
            content: "Deleting!!!",
            key: "delete_row",
          });
          await axiosInstance
            .post("/api/dashboard/experience/details/delete", {
              ids: selectedRowKeys.join(","),
            })
            .then((res) => {
              if (res.data.message === "deleted") {
                messageApi.open({
                  type: "success",
                  content: "The item was deleted",
                  key: "delete_row",
                });

                setExperienceDetails(
                  experienceDetails.filter(
                    (item) => selectedRowKeys.indexOf(item.id) === -1
                  )
                );
              } else {
                messageApi.open({
                  type: "error",
                  content: "The delete operation failed.",
                  key: "delete_row",
                });
              }
            });
        },
      },
    ],
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  message.config({
    duration: 2,
    maxCount: 1,
  });

  const getinfo = useCallback(
    async ({ without_loading = false }) => {
      if (!without_loading) setLoading(true);
      let result = await api.fetchExperiencesDetails({ experienceId });
      setExperienceDetails(result);
      setImg(result.img);
      if (!without_loading) setLoading(false);
    },
    [experienceId]
  );

  useEffect(() => {
    getinfo({});
  }, [getinfo]);

  const clickOnDelete = async ({ experience_details_id }) => {
    messageApi.open({
      type: "loading",
      content: "Deleting!!!",
      key: "delete_row",
    });
    await axiosInstance
      .get("/api/dashboard/experience/details/delete/" + experience_details_id)
      .then((res) => {
        if (res.data.message === "deleted") {
          messageApi.open({
            type: "success",
            content: "The item was deleted",
            key: "delete_row",
          });

          setExperienceDetails(
            experienceDetails.filter(
              (item) => item.id !== experience_details_id
            )
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
      title: "Title of details",
      dataIndex: "title",
      key: "title",
      className: " text-nowrap ",
      render: (_, record) => {
        return (
          <>
            <img
              className={styles.imageView + " me-2  "}
              src={`/api/members/experience/details/img/${record.id}?v=${imageversion}`}
              alt={record.title}
            />
            <label>{record.title}</label>
          </>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      dataIndex: "action",
      className: styles.columnAction,
      fixed: "right",
      key: "action",
      render: (_, record) => (
        <div>
          <Popconfirm
            key="btn_delete_popconfirm"
            title="Delete"
            description="Are you sure to delete this item?"
            onConfirm={() => {
              clickOnDelete({ experience_details_id: record.id });
            }}
            okType="danger"
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined className="p-2 text-danger" />
          </Popconfirm>
          <Link
            onClick={() => {
              showModal({ record });
            }}
          >
            <EditOutlined className="p-2 ms-1 " />
          </Link>
        </div>
      ),
    },
  ];

  const showModal = ({ record }) => {
    setSelectedExperienceDetails(record);
    setIsModalOpen(true);
  };

  const onCompleteSubmit = ({ values }) => {
    getinfo({ without_loading: true });
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExperienceDetails({
      id: 0,
      experienceid: experienceId,
      title: "",
      description: "",
      img: "",
    });
  };

  const handleSubmit = () => {
    formRef.current && formRef.current.submit();
  };

  const onBeforeSubmitFormSend = ({ values }) => {
    values.img = img || "";
    values.experienceid = experienceId;

    return values;
  };

  const onsaveImage = ({ img }) => {
    setImg(img);
  };

  const addNew = () => {
    setSelectedExperienceDetails({
      id: 0,
      experienceid: experienceId,
      title: "",
      description: "",
      img: "",
    });
    setIsModalOpen(true);
  };

  if (loading)
    return (
      <>
        <Divider></Divider>
        <CustomSkeleton
          plane={[{ type: "Input", count: 10, two_column: false }]}
        ></CustomSkeleton>
      </>
    );

  const TrComponent = (props) => {

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props["data-row-key"],
    });
    const style = {
      ...props.style,
      transition,
      transform: CSS.Translate.toString(transform),
      cursor: "move",
      ...(isDragging
        ? {
            position: "relative",
          }
        : {}),
    };
    return (
      <tr
        {...props}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      ></tr>
    );
  };

  return (
    <>
      {contextHolder}
      <Divider orientation="left" plain orientationMargin="0">
        <Link to="/dashboard/index?tab=Experience">
          <label title="Back" onClick={() => {}}>
            <ArrowLeftOutlined className={styles.backIcon} />
          </label>
        </Link>
        <label className={styles.titleEdit + " ms-2"}>
          Details of {experienceTitle}{" "}
        </label>
      </Divider>
      <Button
        icon={<PlusOutlined />}
        type="primary"
        onClick={addNew}
        className="mb-2"
      >
        Add New Detail
      </Button>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#b7d1ad",
            },
          },
        }}
      >
        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={experienceDetails.map((i) => i.key)} // Ensure 'key' exists
            strategy={verticalListSortingStrategy}
          >
            <Table
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              components={{
                body: {
                  row: TrComponent,
                },
              }}
              columns={columns}
              dataSource={experienceDetails}
            ></Table>
          </SortableContext>
        </DndContext>
      </ConfigProvider>
      <Modal
        title={selectedExperienceDetails.title || "New Detail"}
        open={isModalOpen}
        onOk={closeModal}
        onCancel={closeModal}
        style={{ margin: "15px 0" }}
        centered={true}
        maskClosable={false}
        footer={[
          <Button onClick={closeModal} key="btn_cancel" type="default">
            Cancel
          </Button>,
          <Button onClick={handleSubmit} key="btn_Save" type="primary">
            Save
          </Button>,
        ]}
      >
        <Formsend
          onCompleteSubmit={onCompleteSubmit}
          formRef={formRef}
          button={false}
          onBeforeSubmit={onBeforeSubmitFormSend}
          url={
            "/dashboard/updateExperienceDetails/" + selectedExperienceDetails.id
          }
          dataForm={selectedExperienceDetails}
          titleBtn="Save"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24}>
              <CropImage
                onsave={onsaveImage}
                rerender={selectedExperienceDetails}
                size={"auto"}
                circle={false}
                hasValue={false}
                viewUrl={
                  "/api/members/Experience/details/img/" +
                  selectedExperienceDetails.id
                }
                saveUrl={"/dashboard/uploadImageTemp"}
                viewUrlAfterSave={"/api/dashboard/viewImageTemp/"}
                title={selectedExperienceDetails.title}
              >
                <CropImage.View
                  alt={selectedExperienceDetails.id}
                ></CropImage.View>
              </CropImage>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24}>
              <Form.Item
                name="title"
                label="Title"
                rules={[
                  { required: true, message: "Please input your Title!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24}>
              <Form.Item name="description" label="Description">
                <Input.TextArea
                  rows={5}
                  showCount
                  maxLength={1000}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
        </Formsend>
      </Modal>
    </>
  );
};

export default ExperienceDetails;
