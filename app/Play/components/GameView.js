// app/Play/components/GameView.js
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import { renderCardContent } from "./CardRendering";
import { AudioControl } from "./AudioControl";
import styles from "../Play.module.css";

const GameView = ({
  currentCard,
  currentCardIndex,
  cardCount,
  handleClick,
  handleNextCard,
  handlePreviousCard,
  handleExit,
  isFlipped,
  isMultipleMode,
  cards,
  startSide,
  setCardsQueue,
  cardsQueue,
  setCurrentCard,
  setCurrentCardIndex,
  Title,
}) => {
  const [choices, setChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [answeredCards, setAnsweredCards] = useState({}); // สถานะการตอบถูกของการ์ดแต่ละใบ
  const router = useRouter();

  useEffect(() => {
    if (isMultipleMode) {
      generateChoices();
    }
  }, [currentCard, cards]);

  const generateChoices = () => {
    const correctAnswer =
      startSide === "Front"
        ? currentCard.questionBack
        : currentCard.questionFront;
    let wrongChoices = cards
      .filter((card) => card.id !== currentCard.id)
      .map((card) =>
        startSide === "Front" ? card.questionBack : card.questionFront
      );

    // สุ่มเลือกคำตอบผิด 3 ข้อ
    wrongChoices = wrongChoices.sort(() => 0.5 - Math.random()).slice(0, 3);

    // รวมคำตอบที่ถูกต้องและผิดแล้วทำการสุ่มลำดับ
    const allChoices = [...wrongChoices, correctAnswer].sort(
      () => 0.5 - Math.random()
    );
    setChoices(allChoices);
    setSelectedChoice(null);
    setIsAnswerCorrect(null);
  };

  const handleChoiceSelection = (choice) => {
    const correctAnswer =
      startSide === "Front"
        ? currentCard.questionBack
        : currentCard.questionFront;
    setSelectedChoice(choice);
    const isCorrect = choice === correctAnswer;
    setIsAnswerCorrect(isCorrect);

    // อัปเดตสถานะว่าการ์ดนี้ถูกตอบถูกแล้ว
    if (isCorrect) {
      setAnsweredCards((prevAnsweredCards) => ({
        ...prevAnsweredCards,
        [currentCardIndex]: true, // เก็บการ์ดที่ตอบถูกไว้
      }));
    }

    // หน่วงเวลา 1 วินาทีก่อนเปลี่ยนไปข้อถัดไป
    setTimeout(() => {
      if (isCorrect) {
        moveToNextCard(); // เด้งไปข้อถัดไปถ้าตอบถูก
      } else {
        // ถ้าตอบผิดจะเพิ่มการ์ดนี้ใน queue เพื่อวนมาถามใหม่
        setCardsQueue((prevQueue) => {
          // เพิ่มการ์ดที่ตอบผิดไปยัง queue
          const newQueue = [...prevQueue];
          if (!newQueue.find((card) => card.id === currentCard.id)) {
            newQueue.push(currentCard);
          }
          return newQueue;
        });
        moveToNextCard(); // เด้งไปข้อถัดไปทันทีแม้ตอบผิด
      }

      // รีเซ็ตตัวเลือกและการตอบ
      setSelectedChoice(null);
      setIsAnswerCorrect(null);
    }, 1000); // หน่วงเวลา 1 วินาทีเพื่อให้ผู้ใช้เห็นการเปลี่ยนสี
  };

  const moveToNextCard = () => {
    if (cardsQueue.length > 0) {
      const nextCard = cardsQueue[0]; // ดึงการ์ดแรกจาก queue
      setCardsQueue((prevQueue) => prevQueue.slice(1)); // ลบการ์ดที่แสดงออกจาก queue
      setCurrentCard(nextCard); // อัปเดตการ์ดปัจจุบัน
      setCurrentCardIndex(cards.findIndex((card) => card.id === nextCard.id)); // อัปเดต index
    } else if (currentCardIndex < cardCount - 1) {
      handleNextCard(); // เด้งไปข้อถัดไปถ้าไม่มีการ์ดใน queue
    } else {
      // เมื่อครบทุกข้อและตอบถูกหมดแล้ว ให้แสดงข้อความ success
      alert("Success!");
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 w-full h-0 ">
        <div className="text-wrap p-7">
          {Title}  {currentCardIndex + 1} / {cardCount}
        </div>

        <div className="flex items-center justify-end pr-10">
          <FontAwesomeIcon
            style={{ fontSize: "40px", cursor: "pointer" }}
            icon={faSquareXmark}
            onClick={handleExit}
          />
        </div>
      </div>

      {!isMultipleMode ? (
        // Single Mode
        <div
          className={`${styles["flip-card"]} cursor-pointer`}
          onClick={handleClick}
        >
          <div
            className={`${styles["flip-card-inner"]} ${
              isFlipped ? styles["flipped"] : ""
            }`}
          >
            <div className={`${styles["flip-card-front"]} my-2 space-y-0`}>
              <div className={`p-4 ${currentCard.layoutFront || ""}`}>
                {startSide === "Front"
                  ? currentCard.questionFront
                  : currentCard.questionBack}
              </div>
            </div>
            <div className={styles["flip-card-back"]}>
              <div className={`p-4 ${currentCard.layoutBack || ""}`}>
                {startSide === "Front"
                  ? currentCard.questionBack
                  : currentCard.questionFront}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Multiple Mode
        <div className="my-4 p-16">
          <div className="text-xl mb-4 p-4 bg-white rounded-lg shadow-md">
            {startSide === "Front"
              ? currentCard.questionFront
              : currentCard.questionBack}
          </div>
          <div className="space-y-4">
            {choices.map((choice, index) => {
              const isCorrectChoice =
                startSide === "Front"
                  ? currentCard.questionBack
                  : currentCard.questionFront;
              const isAnsweredCorrectly =
                answeredCards[currentCardIndex] && choice === isCorrectChoice;

              return (
                <div
                  key={index}
                  className={`p-4 bg-gray-200 rounded-md shadow-md cursor-pointer ${
                    selectedChoice === choice
                      ? isAnswerCorrect === true
                        ? "bg-green-400" // ถ้าตอบถูก เปลี่ยนเป็นสีเขียว
                        : "bg-red-400" // ถ้าตอบผิด เปลี่ยนเป็นสีแดง
                      : isAnsweredCorrectly
                      ? "bg-green-400" // คงสีเขียวไว้ถ้าข้อนี้เคยถูกตอบถูกแล้ว
                      : ""
                  }`}
                  onClick={() => handleChoiceSelection(choice)}
                >
                  {choice}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="m-5">
        <span className="flex justify-center space-x-5">
          <FontAwesomeIcon
            style={{ fontSize: "40px", cursor: "pointer" }}
            icon={faCircleArrowLeft}
            onClick={handlePreviousCard}
          />
          <FontAwesomeIcon
            style={{ fontSize: "40px", cursor: "pointer" }}
            icon={faCircleArrowRight}
            onClick={handleNextCard}
          />
        </span>
      </div>
    </>
  );
};

export default GameView;
