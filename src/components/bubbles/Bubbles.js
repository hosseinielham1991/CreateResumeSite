import React from "react";
import styles from "./Bubbles.module.css";
function Bubbles() {
  return (
    <div className={styles.background}>
      <ul className={styles.bgBubbles}>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
}

export default Bubbles;
