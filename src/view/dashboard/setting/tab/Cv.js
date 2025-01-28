import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import axiosInstance from "../../../../utils/axiosInstance";
const Cv = ({ cv, userid }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleteFile, setDeleteFile] = useState(0);

  useEffect(() => {
    if (cv !== "") {
      setFileList([
        {
          uid: userid,
          userid: userid,
          name: cv,
          status: "done",
          url: `/api/members/downloadCv/${userid}`,
        },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cv]);

  message.config({
    duration: 2,
    maxCount: 1,
  });

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("file", file);
    });

    if (deleteFile !== 0 && fileList.length === 0) {
      formData.append("delete", deleteFile);
    }

    setUploading(true);
    // You can use any AJAX library you like
    await axiosInstance
      .post("/api/dashboard/uploadCv", formData)
      .then(function (res) {
        if (res.data?.info?.id && fileList.length) {
          setFileList([
            {
              uid: res.data.info.id,
              userid: res.data.info.id,
              name: res.data.info.name,
              status: "done",
              url: `/api/members/downloadCv/${res.data.info.id}`,
            },
          ]);

          messageApi.open({
            type: "success",
            content: "upload successfully.",
            key: "add_file",
          });
        } else if (res.data?.info?.delete === 1) {
          messageApi.open({
            type: "success",
            content: "file was deleted.",
            key: "add_file",
          });
        }
      })
      .catch((res) => {
        messageApi.open({
          type: "error",
          content: "upload failed.",
          key: "error_file",
        });
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const props = {
    accept: ".pdf, .doc, .docx", // Restrict to PDF, Word documents, and images
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      if (file.userid) {
        setDeleteFile(file.userid);
      }
    },
    onDownload: (file) => {
      return false;
    },
    beforeUpload: (file) => {
      const isPdf = file.type === "application/pdf";
      const isWord =
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const isImage = file.type.startsWith("image/");

      if (!isPdf && !isWord && !isImage) {
        messageApi.open({
          type: "error",
          content: `${file.name} is not a valid file type`,
          key: "error_file",
        });
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);

      return false;
    },
    fileList,
  };

  return (
    <>
      {contextHolder}
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select File Cv</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        loading={uploading}
        style={{
          marginTop: 16,
        }}
      >
        {uploading ? "Saving" : "Save"}
      </Button>
    </>
  );
};

export default Cv;
