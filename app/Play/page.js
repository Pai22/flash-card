"use client";
import React, { useState } from "react";
import styles from "./Play.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faCircleArrowLeft,
  faCircleArrowRight,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";

export default function Play() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full h-screen items-start justify-center bg-sky-200  rounded-sm ">
      <div className="grid grid-cols-3 w-full h-20 bg-violet-200 border-violet-400 border-2">
        <div></div>
        <div className="text-center p-7">1 / 4</div>
        <div className="flex items-center justify-end pr-10">
          <FontAwesomeIcon style={{ fontSize: "40px" }} icon={faSquareXmark} />
        </div>
      </div>

      <div
        className={`${styles["flip-card"]} cursor-pointer`}
        onClick={handleClick}
      >
        <div
          className={`${styles["flip-card-inner"]} ${
            isFlipped ? styles["flipped"] : ""
          }`}
        >
          <ul
            className={`${styles["flip-card-front"]} my-2 space-y-0`}
          >
            <li className="bg-yellow-100"> text </li>
          </ul>

          <div className={styles["flip-card-back"]}>
            <h1 className={styles["title"]}>ผ่าน</h1>
            {/* เพิ่มเนื้อหาเพิ่มเติมถ้าต้องการ */}
          </div>
        </div>
        <div className=" m-5">
          <span className="flex justify-center space-x-5">
            <FontAwesomeIcon
              style={{ fontSize: "40px" }}
              icon={faCircleArrowLeft}
            ></FontAwesomeIcon>
            <FontAwesomeIcon
              style={{ fontSize: "40px" }}
              icon={faCircleArrowRight}
            ></FontAwesomeIcon>
          </span>
        </div>
      </div>
    </div>
  );
}
