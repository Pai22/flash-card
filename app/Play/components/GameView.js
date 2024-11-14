// app/Play/components/GameView.js
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faPlay,
  faPause,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../lip/firebase/clientApp";
import useAuth from "../../lip/hooks/useAuth";
import { renderCardContent } from "./CardRendering";
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
  Title,
  deckId,
  friendCards,
}) => {
  const [choices, setChoices] = useState([]);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [answeredCards, setAnsweredCards] = useState({});
  const [generatedChoices, setGeneratedChoices] = useState({});
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [audioRefs, setAudioRefs] = useState({});
  const [isPlaying, setIsPlaying] = useState({});
  const [isPlayingFront, setIsPlayingFront] = useState(false);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const audioRefFront = useRef(null);
  const audioRefBack = useRef(null);
  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isMultipleMode) {
      if (generatedChoices[currentCard.id]) {
        setChoices(generatedChoices[currentCard.id]);
      } else {
        generateChoices();
      }
    }
  }, [currentCard, cards]);

  useEffect(() => {
    // หยุดเสียงเมื่อเปลี่ยนการ์ด
    if (audioRefFront.current) {
      audioRefFront.current.pause();
      audioRefFront.current.currentTime = 0;
    }
    if (audioRefBack.current) {
      audioRefBack.current.pause();
      audioRefBack.current.currentTime = 0;
    }

    // รีเซ็ตสถานะการเล่นเมื่อมีการเปลี่ยนการ์ด
    setIsPlayingFront(false);
    setIsPlayingBack(false);
  }, [currentCard]);

  useEffect(() => {
    // สร้าง audioRefs ใหม่ทุกครั้งเมื่อช้อยส์เปลี่ยน
    const newAudioRefs = choices.reduce((acc, choice, index) => {
      acc[index] = React.createRef();
      return acc;
    }, {});
    setAudioRefs(newAudioRefs);
    setIsPlaying({}); // รีเซ็ตสถานะการเล่น
  }, [choices]);

  const handleAudioPlayPause = (e, index) => {
    e.stopPropagation(); // หยุดการกระจายเหตุการณ์คลิกไปยังพาเรนต์
    if (!audioRefs[index]?.current) return;

    const isPlayingNow = isPlaying[index] ?? false;

    if (isPlayingNow) {
      audioRefs[index].current.pause();
      audioRefs[index].current.currentTime = 0;
    } else {
      // หยุดเสียงอื่นๆ
      Object.values(audioRefs).forEach((audio, i) => {
        if (audio.current) {
          audio.current.pause();
          audio.current.currentTime = 0;
        }
        setIsPlaying((prevState) => ({ ...prevState, [i]: false }));
      });
      audioRefs[index].current.play();
    }

    setIsPlaying((prevState) => ({ ...prevState, [index]: !isPlayingNow }));
  };

  const handleAudioPlayPauseFront = () => {
    if (isPlayingFront) {
      audioRefFront.current.pause();
    } else {
      audioRefFront.current.play();
    }
    setIsPlayingFront(!isPlayingFront);
  };

  const handleAudioPlayPauseBack = () => {
    if (isPlayingBack) {
      audioRefBack.current.pause();
    } else {
      audioRefBack.current.play();
    }
    setIsPlayingBack(!isPlayingBack);
  };

  const generateChoices = () => {
    const correctAnswer = {
      layoutFront: currentCard.layoutFront,
      layoutBack: currentCard.layoutBack,
      questionFront: currentCard.questionFront,
      questionBack: currentCard.questionBack,
      audioUrlFront: currentCard.audioUrlFront,
      audioUrlBack: currentCard.audioUrlBack,
      imageUrlFront: currentCard.imageUrlFront,
      imageUrlBack: currentCard.imageUrlBack,
    };

    let wrongChoices = cards
      .filter((card) => card.id !== currentCard.id)
      .map((card) => ({
        layoutFront: card.layoutFront,
        layoutBack: card.layoutBack,
        questionFront: card.questionFront,
        questionBack: card.questionBack,
        audioUrlFront: card.audioUrlFront,
        audioUrlBack: card.audioUrlBack,
        imageUrlFront: card.imageUrlFront,
        imageUrlBack: card.imageUrlBack,
      }));

    wrongChoices = wrongChoices.sort(() => 0.5 - Math.random()).slice(0, 3);
    const allChoices = [...wrongChoices, correctAnswer].sort(
      () => 0.5 - Math.random()
    );

    setGeneratedChoices((prevChoices) => ({
      ...prevChoices,
      [currentCard.id]: allChoices,
    }));

    setChoices(allChoices);
    setSelectedChoice(null);
    setIsAnswerCorrect(null);
  };

  const handleChoiceSelection = (choice, index) => {
    if (answeredCards[currentCardIndex]) return;

    // คำตอบที่ถูกต้อง
    const correctAnswer =
      startSide === "Front"
        ? currentCard.questionBack ||
          currentCard.audioUrlBack ||
          currentCard.imageUrlBack
        : currentCard.questionFront ||
          currentCard.audioUrlFront ||
          currentCard.imageUrlFront;

    // เปรียบเทียบตัวเลือก
    const isCorrect =
      choice.questionBack === correctAnswer ||
      choice.audioUrlBack === correctAnswer ||
      choice.imageUrlBack === correctAnswer ||
      choice.questionFront === correctAnswer ||
      choice.audioUrlFront === correctAnswer ||
      choice.imageUrlFront === correctAnswer;

    setSelectedChoice(choice);
    setIsAnswerCorrect(isCorrect);

    setAnsweredCards((prevAnsweredCards) => ({
      ...prevAnsweredCards,
      [currentCardIndex]: {
        isCorrect,
        selectedChoice: choice,
      },
    }));

    setTimeout(() => {
      moveToNextCard();
    }, 1000);
  };

  const moveToNextCard = () => {
    if (currentCardIndex < cardCount - 1) {
      handleNextCard();
    } else {
      setShowScorePopup(true);
    }
  };

  const handleNavigate = () => {
    router.push("/dashboard");
    handleGameEnd();
  };

  const handleGameEnd = async () => {
    const endTime = Date.now();
    const totalTime = Math.floor((endTime - startTime) / 1000);
    const correctAnswersCount = Object.values(answeredCards).filter(
      (card) => card.isCorrect
    ).length;

    if (user && friendCards == null) {
      await saveResultToFirestore(correctAnswersCount, totalTime, cardCount);
    } else {
      await saveResultToFirestoreF(correctAnswersCount, totalTime, cardCount);
    }
  };

  const saveResultToFirestore = async (score, time, cardCount) => {
    try {
      const gameResultsRef = collection(
        db,
        "Deck",
        user.uid,
        "title",
        deckId,
        "gameResults"
      );

      // บันทึกผลลัพธ์ใหม่
      await addDoc(gameResultsRef, {
        score,
        cardCount,
        time,
        timestamp: new Date(),
      });

      // ดึงผลลัพธ์ทั้งหมดเพื่อตรวจสอบและลบรายการที่เกิน
      const resultsQuery = query(gameResultsRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(resultsQuery);

      // ตรวจสอบจำนวนผลลัพธ์
      if (querySnapshot.docs.length > 5) {
        const docsToDelete = querySnapshot.docs.slice(5);
        for (const docToDelete of docsToDelete) {
          await deleteDoc(doc(gameResultsRef, docToDelete.id));
        }
      }
    } catch (error) {
      console.error("Error saving game result: ", error);
    }
  };

  // const saveResultToFirestore = async (score, time, cardCount) => {
  //   try {
  //     const gameResultsRef = collection(
  //       db,
  //       "Deck",
  //       user.uid,
  //       "title",
  //       deckId,
  //       "gameResults"
  //     );

  //     await addDoc(gameResultsRef, {
  //       score,
  //       cardCount,
  //       time,
  //       timestamp: new Date(),
  //     });

  //     const resultsQuery = query(
  //       gameResultsRef,
  //       orderBy("timestamp", "desc"),
  //       limit(5)
  //     );
  //     const querySnapshot = await getDocs(resultsQuery);

  //     const docsToDelete = querySnapshot.docs.slice(5);
  //     for (const docToDelete of docsToDelete) {
  //       await deleteDoc(doc(gameResultsRef, docToDelete.id));
  //     }
  //   } catch (error) {
  //     console.error("Error saving game result: ", error);
  //   }
  // };
  const saveResultToFirestoreF = async (score, time, cardCount) => {
    try {
      const gameResultsRef = collection(
        db,
        "Deck",
        user.uid,
        "deckFriend",
        deckId,
        "gameResults"
      );

      await addDoc(gameResultsRef, {
        score,
        cardCount,
        time,
        timestamp: new Date(),
      });

      const resultsQuery = query(gameResultsRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(resultsQuery);

      // ตรวจสอบจำนวนผลลัพธ์
      if (querySnapshot.docs.length > 5) {
        const docsToDelete = querySnapshot.docs.slice(5);
        for (const docToDelete of docsToDelete) {
          await deleteDoc(doc(gameResultsRef, docToDelete.id));
        }
      }
    } catch (error) {
      console.error("Error saving game result: ", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 w-full h-0 ">
        <div className="text-wrap p-7">
          {Title} {currentCardIndex + 1} / {cardCount}
        </div>

        <div
          className="col-start-12 border-2 rounded-lg w-10 h-10 bg-red-600 text-white flex justify-center items-center cursor-pointer active:bg-red-700 active:scale-95 transition-transform duration-150 mt-1"
          onClick={handleExit}
        >
          <FontAwesomeIcon
            className="text-white text-md"
            icon={faTimes}
          />
        </div>
      </div>

      {!isMultipleMode ? (
        <>
          <div
            className={`${styles["flip-card"]} cursor-pointer`}
            onClick={handleClick}
          >
            <div
              className={`${styles["flip-card-inner"]} ${
                isFlipped ? styles["flipped"] : ""
              }`}
            >
              {/* Front side of the card */}
              <div className={`${styles["flip-card-front"]} my-2 space-y-0`}>
                <div className={`p-4 ${currentCard.layoutFront || ""}`}>
                  {renderCardContent(currentCard, "front")}
                  {currentCard.audioUrlFront && (
                    <div className={styles.audioButton}>
                      <audio
                        ref={audioRefFront}
                        className="hidden"
                        onEnded={() => setIsPlayingFront(false)}
                        key={currentCard.audioUrlFront} // ใช้ key เพื่อรีเฟรชเสียงเมื่อการ์ดเปลี่ยน
                      >
                        <source
                          src={currentCard.audioUrlFront}
                          type="audio/mp3"
                        />
                        Your browser does not support the audio element.
                      </audio>

                      <FontAwesomeIcon
                        icon={isPlayingFront ? faPause : faPlay}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent flip when clicking play
                          handleAudioPlayPauseFront();
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Back side of the card */}
              <div className={styles["flip-card-back"]}>
                <div className={`p-4 ${currentCard.layoutBack || ""}`}>
                  {renderCardContent(currentCard, "back")}
                  {currentCard.audioUrlBack && (
                    <div className={styles.audioButton}>
                      <audio
                        ref={audioRefBack}
                        className="hidden"
                        onEnded={() => setIsPlayingBack(false)}
                        key={currentCard.audioUrlBack} // ใช้ key เพื่อรีเฟรชเสียงเมื่อการ์ดเปลี่ยน
                      >
                        <source
                          src={currentCard.audioUrlBack}
                          type="audio/mp3"
                        />
                        Your browser does not support the audio element.
                      </audio>

                      <FontAwesomeIcon
                        icon={isPlayingBack ? faPause : faPlay}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent flip when clicking play
                          handleAudioPlayPauseBack();
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // โค้ดสำหรับโหมด Multiple
        <>
          <div className={styles["container"]}>
            <div className="w-1/2 flex items-center justify-center">
              <div className="bg-white text-center p-10 m-10 shadow-lg w-4/5 h-full">
                {/* คำถาม */}
                {startSide === "Front"
                  ? renderCardContent(currentCard, "front")
                  : renderCardContent(currentCard, "back")}
                {startSide === "Front" && currentCard.audioUrlFront && (
                  <div className={styles.audioButton}>
                    <audio
                      ref={audioRefFront}
                      className="hidden"
                      onEnded={() => setIsPlayingFront(false)}
                      key={currentCard.audioUrlFront}
                    >
                      <source
                        src={currentCard.audioUrlFront}
                        type="audio/mp3"
                      />
                      Your browser does not support the audio element.
                    </audio>

                    <FontAwesomeIcon
                      icon={isPlayingFront ? faPause : faPlay}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAudioPlayPauseFront();
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                )}
                {startSide === "Back" && currentCard.audioUrlBack && (
                  <div className={styles.audioButton}>
                    <audio
                      ref={audioRefBack}
                      className="hidden"
                      onEnded={() => setIsPlayingBack(false)}
                      key={currentCard.audioUrlBack}
                    >
                      <source src={currentCard.audioUrlBack} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>

                    <FontAwesomeIcon
                      icon={isPlayingBack ? faPause : faPlay}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAudioPlayPauseBack();
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="w-1/2 grid grid-cols-2 gap-4">
              {choices.map((choice, index) => {
                const isSelectedChoice =
                  answeredCards[currentCardIndex] &&
                  answeredCards[currentCardIndex].selectedChoice === choice;
                const choiceStyle = isSelectedChoice
                  ? "bg-blue-400"
                  : "bg-gray-200";

                return (
                  <div
                    key={index}
                    className={`p-6 text-center rounded-lg shadow-md cursor-pointer ${choiceStyle}`}
                    onClick={() => handleChoiceSelection(choice, index)}
                  >
                    {/* Render choice content */}
                    {startSide === "Front"
                      ? renderCardContent(choice, "back")
                      : renderCardContent(choice, "front")}

                    {/* Add audio for each choice */}
                    {startSide === "Front"
                      ? choice.audioUrlBack && (
                          <div className={styles.audioButton}>
                            <audio
                              ref={audioRefs[index]}
                              className="hidden"
                              onEnded={() =>
                                setIsPlaying((prevState) => ({
                                  ...prevState,
                                  [index]: false,
                                }))
                              }
                              key={choice.audioUrlBack}
                            >
                              <source
                                src={choice.audioUrlBack}
                                type="audio/mp3"
                              />
                              Your browser does not support the audio element.
                            </audio>

                            <FontAwesomeIcon
                              icon={isPlaying[index] ? faPause : faPlay}
                              onClick={(e) => handleAudioPlayPause(e, index)}
                              className="cursor-pointer"
                            />
                          </div>
                        )
                      : choice.audioUrlFront && (
                          <div className={styles.audioButton}>
                            <audio
                              ref={audioRefs[index]}
                              className="hidden"
                              onEnded={() =>
                                setIsPlaying((prevState) => ({
                                  ...prevState,
                                  [index]: false,
                                }))
                              }
                              key={choice.audioUrlFront}
                            >
                              <source
                                src={choice.audioUrlFront}
                                type="audio/mp3"
                              />
                              Your browser does not support the audio element.
                            </audio>

                            <FontAwesomeIcon
                              icon={isPlaying[index] ? faPause : faPlay}
                              onClick={(e) => handleAudioPlayPause(e, index)}
                              className="cursor-pointer"
                            />
                          </div>
                        )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {showScorePopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">สรุปผลคะแนน</h2>
            <p>
              คุณตอบถูก{" "}
              {
                Object.values(answeredCards).filter((card) => card.isCorrect)
                  .length
              }{" "}
              ข้อจากทั้งหมด {cardCount} ข้อ
            </p>
            <button
              onClick={handleNavigate}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}

      <div>
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
