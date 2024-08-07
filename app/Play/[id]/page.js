// app/Play/[id]/page.js
"use client";
import React, { useState, useEffect } from "react";
import { db } from '../../lip/firebase/clientApp';
import { onSnapshot, collection } from "firebase/firestore";
import useAuth from "../../lip/hooks/useAuth";
import { useParams, useRouter } from "next/navigation";
import styles from "../Play.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft, faCircleArrowRight, faSquareXmark } from "@fortawesome/free-solid-svg-icons";

export default function Play() {
  const { id: deckId } = useParams();
  const [cards, setCards] = useState([]);
  const auth = useAuth();
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(true);
  const [mode, setMode] = useState("Single");
  const [startSide, setStartSide] = useState("Front");
  const [cardCount, setCardCount] = useState(0);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleExit = () => {
    router.push("/dashboard");
  };

  const handleStart = () => {
    setShowPopup(false);
    if (startSide === "Back") {
      setIsFlipped(true);
    }
  };

  useEffect(() => {
    if (!auth || !deckId) return;
    const cardsRef = collection(db, "Deck", auth.uid, "title", deckId, "cards");
    const unsubscribeCards = onSnapshot(cardsRef, (snapshot) => {
      if (!snapshot.empty) {
        const cardData = snapshot.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setCards(cardData);
        setCardCount(cardData.length);
      } else {
        setCards([]);
        setCardCount(0);
      }
      setLoading(false);
    });
    return () => unsubscribeCards();
  }, [auth, deckId]);

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="w-full h-screen items-start justify-center bg-sky-200 rounded-sm">
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-4">Option</h2>
            <div className="mb-4">
              <label className="block font-medium mb-2">Select Mode</label>
              <select
                className="w-full border border-gray-300 p-2 rounded-md"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="Single">Single mode</option>
                <option value="Multiple">Multiple mode</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Start Side</label>
              <select
                className="w-full border border-gray-300 p-2 rounded-md"
                value={startSide}
                onChange={(e) => setStartSide(e.target.value)}
              >
                <option value="Front">Front</option>
                <option value="Back">Back</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Question</label>
              <p>{`Total cards: ${cards.length}`}</p>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Number of Cards to Play</label>
              <input
                type="number"
                className="w-full border border-gray-300 p-2 rounded-md"
                value={cardCount}
                onChange={(e) => setCardCount(Math.min(cards.length, Math.max(1, e.target.value)))}
              />
            </div>
            <div className="flex justify-end">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleStart}>
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      {!showPopup && (
        <>
          <div className="grid grid-cols-3 w-full h-20 bg-violet-200 border-violet-400 border-2">
            <div></div>
            <div className="text-center p-7">
              {currentCardIndex + 1} / {cardCount}
            </div>
            <div className="flex items-center justify-end pr-10">
              <FontAwesomeIcon
                style={{ fontSize: "40px", cursor: "pointer", color: "#e5380e"}}
                icon={faSquareXmark}
                onClick={handleExit}
              />
            </div>
          </div>

          <div className={`${styles["flip-card"]} cursor-pointer`} onClick={handleClick}>
            <div className={`${styles["flip-card-inner"]} ${isFlipped ? styles["flipped"] : ""}`}>
              <div className={`${styles["flip-card-front"]} my-2 space-y-0`}>
                <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
                  <h3 className="font-bold mb-2">Question:</h3>
                  <p>{currentCard.questionFront}</p>
                  {currentCard.imageUrlFront && (
                    <img src={currentCard.imageUrlFront} alt="front image" className="w-full mt-2" />
                  )}
                  {currentCard.audioUrlFront && (
                    <audio controls className="w-full mt-2">
                      <source src={currentCard.audioUrlFront} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </div>
              <div className={styles["flip-card-back"]}>
                <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
                  <h3 className="font-bold mb-2">Answer:</h3>
                  <p>{currentCard.questionBack}</p>
                  {currentCard.imageUrlBack && (
                    <img src={currentCard.imageUrlBack} alt="back image" className="w-full mt-2" />
                  )}
                  {currentCard.audioUrlBack && (
                    <audio controls className="w-full mt-2">
                      <source src={currentCard.audioUrlBack} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="m-7">
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
      )}
    </div>
  );
}
