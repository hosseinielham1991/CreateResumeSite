import React, { useEffect, useState, createContext, useContext } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { Modal, Button, Popconfirm } from "antd";
import styles from "./CropImage.module.css";
import axiosInstance from "../../utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const CropImageContext = createContext();

const CropImage = ({
  rerender,
  children,
  circle = true,
  viewUrl,
  title,
  saveUrl,
  onsave,
  hasValue = false,
  viewUrlAfterSave,
  size = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState("");
  const [imgSrc, setImgSrc] = useState();
  const [crop, setCrop] = useState({ unit: "%", width: 50, aspect: 1 });
  const [errorCrop, setErrorCrop] = useState("");
  const [imageversion, setImageversion] = useState(
    Math.floor(Math.random() * 1000)
  );
  const [viewUrlDefault, setViewUrlDefault] = useState(viewUrl);

  useEffect(() => {
    setViewUrlDefault(viewUrl);
    setErrorCrop("");
    setImgSrc("");
    setFile("");
    setCrop(undefined);
  }, [viewUrl,rerender]);

  useEffect(() => {
    const html = document.querySelector("html");
    if (open) {
      html.style.overflowY = "hidden";
    } else {
      html.style.overflowY = "";
    }
    // Optional: Handle cleanup if component unmounts while modal is open
    return () => {
      html.style.overflowY = "";
      setErrorCrop("");
      setImgSrc("");
    };
  }, [open]);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    // onsave({crop,file});

    let formData = new FormData();
    //Adding files to the formdata
    formData.append("image", file);

    Object.entries(crop).map((item) => {
      formData.append(item[0], item[1]);
      return item;
    });
    setLoading(true);
    await axiosInstance
      .post("/api" + saveUrl, formData)
      .then(function (res) {
        if (viewUrlAfterSave === undefined)
          setImageversion(Math.floor(Math.random() * 1000));
        else setViewUrlDefault(viewUrlAfterSave + res.data.info.img);

        onsave({ img: res.data.info.img });
      })
      .catch((error) => {
        console.error("Fetching data failed:", error.response);
      })
      .finally(() => {
        setLoading(false);
        setOpen(false);
      });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const MIN_DIMENSION = 100;

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageurl = reader.result?.toString() || "";
      imageElement.src = imageurl;
      imageElement.addEventListener("load", (e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;

        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setErrorCrop("Image must be at least 100 * 100 px");
          setImgSrc("");
          return false;
        }
        setErrorCrop("");
        setImgSrc(imageurl);

      });
    });

    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      1,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

 
  const confirm = async (e) => {
    await axiosInstance
      .post("/api" + saveUrl, { delete: 1 })
      .then(function (res) {
        setImageversion(Math.floor(Math.random() * 1000));
      })
      .catch((error) => {
        console.error("Fetching data failed:", error.response);
      });
  };

  return (
    <CropImageContext.Provider
      value={{ imageversion, viewUrlDefault, size, circle }}
    >
      <div className={styles.userAvatar + "  "}>
        <span
          className="d-flex justify-content-center align-items-center flex-column"
          onClick={showModal}
        >
          {children}

          <div className={styles.holdeEditImg + " rounded-circle"}>
            <FontAwesomeIcon
              size="xs"
              className={styles.btnEdit}
              icon={faPen}
            />
          </div>
        </span>
        <Modal
          style={{ margin: "15px 0" }}
          centered={true}
          maskClosable={false}
          open={open}
          title={title}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <div key="holder_btn_in_footer" className="row">
              <div className="col-4 d-flex flex-row-reverse ">
                <Popconfirm
                  key="btn_delete_popconfirm"
                  title="Delete the Image"
                  description="Are you sure to delete this task?"
                  onConfirm={confirm}
                  okType="danger"
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    style={imgSrc || !hasValue ? { display: "none" } : {}}
                    key="btn_delete"
                    className="me-auto"
                    danger
                  >
                    delete
                  </Button>
                </Popconfirm>
              </div>
              <div className="col-8">
                <Button
                  style={!imgSrc ? { display: "none" } : {}}
                  key="btn_save"
                  className="pull-right"
                  type="primary"
                  loading={loading}
                  onClick={handleOk}
                >
                  Save
                </Button>
                <Button key="btn_upload_image" type="primary">
                  <input
                    className={styles.btnUpload}
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                  />
                  Select Image
                </Button>
              </div>
            </div>,
          ]}
        >
          {errorCrop && (
            <div
              className={
                styles.holderDivError +
                " d-flex flex-column text-danger justify-content-center align-items-center "
              }
            >
              <label>{errorCrop}</label>
            </div>
          )}
          {!imgSrc && !errorCrop && (
            <div className="d-flex flex-column text-danger justify-content-center align-items-center">
              <img
                className={styles.privewDefaultImg}
                src={viewUrlDefault + `?v=${imageversion}`}
                alt="New Img"
              />
            </div>
          )}
          {imgSrc && (
            <div className="d-flex flex-column justify-content-center align-items-center">
              <ReactCrop
                crop={crop}
                onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                circularCrop={circle}
                disabled={loading}
                keepSelection
                aspect={(size!=="auto"?1:null)}
                minWidth={MIN_DIMENSION}
                minHeight={MIN_DIMENSION}
              >
                <img
                  src={imgSrc}
                  alt="New Img"
                  onLoad={onImageLoad}
                  style={{ maxHeight: "70vh" }}
                />
              </ReactCrop>
            </div>
          )}
        </Modal>
      </div>
    </CropImageContext.Provider>
  );
};
// ... rest of CropImage component ...

CropImage.Button = ({ onClick, children }) => {
  return <>{children}</>;
};

// Proper function component names start with an uppercase letter
const CropImageView = ({ alt }) => {
  const { imageversion, viewUrlDefault, size, circle } =
    useContext(CropImageContext);
  return (
    <img
      style={
        size !== "" && size !== "auto"
          ? { width: `${size}px`, height: `${size}px` }
          : {}
      }
      className={
        styles.imageView +
        (circle ? " rounded-circle" : "") +
        (size === "auto" ? " "+styles.autoWidth : "")
      }
      src={`${viewUrlDefault}?v=${imageversion}`}
      alt={alt}
    />
  );
};

// Since CropImage.View is used directly, you can assign CropImageView to it
CropImage.View = CropImageView;

export default CropImage;
