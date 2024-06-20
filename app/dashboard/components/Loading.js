import React from "react";
import styles from "../../styles/Loading.module.css"

const LoadingComponent = () => {
  return (
    <div class={styles.blocks}>
      <div class={styles.block}></div>
      <div class={styles.block}></div>
      <div class={styles.block}></div>
      <div class={styles.block}></div>
    </div>
  );
};

export default LoadingComponent;
