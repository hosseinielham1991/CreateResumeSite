import styles from "./Error404.module.css";
const Error404 = () => {
  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <div className={styles.notFoundContainer}>
          <img src="/error.jpg" className=" " alt={"error"} />
          <p className={styles.notFoundMessage}>
            Sorry, the page you are looking for does not exist.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error404;
