// app/Play/[id]/page.js
"use client";
import React, { useState, useEffect } from "react";
import useAuth from "../../lip/hooks/useAuth";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { fetchCards } from "../components/useFirebase";
import Popup from "../components/Popup";
import GameView from "../components/GameView";
import { Button } from "@nextui-org/react";

// ฟังก์ชันเพื่อสุ่มลำดับของการ์ด
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

export default function Play() {
  const { id: deckId } = useParams();
  const searchParams = useSearchParams();
  const Title = searchParams.get("Title");
  const friendCards = searchParams.get("friendCards");
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
  const [friendId, setFriendId] = useState("");
  const [deck, setDeck] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    if (auth && deckId) {
      // ใช้ fetchCards โดยรอ friendId ก่อนดึงการ์ดของเพื่อน
      return fetchCards(
        deckId,
        friendCards,
        auth,
        (fetchedCards) => {
          // สุ่มลำดับการ์ดก่อนบันทึกใน state
          const shuffledCards = shuffleArray(fetchedCards);
          setCards(shuffledCards);
          setCardCount(shuffledCards.length);
        },
        setCardCount,
        setLoading,
        setFriendId,
        setDeck
      );
    }
  }, [auth, deckId, friendId]); // เพิ่ม friendId ใน dependency

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  const currentCard = cards[currentCardIndex];

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (
      currentCardIndex < cardCount - 1 &&
      currentCardIndex < cards.length - 1
    ) {
      setCurrentCardIndex(currentCardIndex + 1);
      //   รักษาสถานะการพลิกการ์ดตาม startSide
      if (startSide === "Back") {
        setIsFlipped(true); // เปลี่ยนไปที่ด้านหลัง
      } else {
        setIsFlipped(false); // เปลี่ยนไปที่ด้านหน้า
      }
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      //   รักษาสถานะการพลิกการ์ดตาม startSide
      if (startSide === "Back") {
        setIsFlipped(true); // เปลี่ยนไปที่ด้านหลัง
      } else {
        setIsFlipped(false); // เปลี่ยนไปที่ด้านหน้า
      }
    }
  };

  const handleExit = () => {
    setIsPopupVisible(!isPopupVisible);
    // alert("Exit");
    // router.push("/dashboard");
  };

  const handleBackToDashboard = () => {
    setIsPopupVisible(false);
    router.push("/dashboard");
  };

  const handleStart = () => {
    setShowPopup(false);
    setIsFlipped(startSide === "Back");
  };

  const isMultipleMode = mode === "Multiple";

  return (
    <div className="w-full h-screen items-start justify-center bg-sky-200 rounded-sm">
      {showPopup ? (
        <Popup
          mode={mode}
          setMode={setMode}
          startSide={startSide}
          setStartSide={setStartSide}
          cardCount={cardCount}
          setCardCount={setCardCount}
          handleStart={handleStart}
          cards={cards}
          setLoading={setLoading}
        />
      ) : (
        <GameView
          currentCard={currentCard}
          currentCardIndex={currentCardIndex}
          cardCount={cardCount}
          handleClick={handleClick}
          handleNextCard={handleNextCard}
          handlePreviousCard={handlePreviousCard}
          handleExit={handleExit}
          isFlipped={isFlipped}
          isMultipleMode={isMultipleMode}
          cards={cards}
          startSide={startSide}
          setCurrentCardIndex={setCurrentCardIndex}
          Title={Title}
          deckId={deckId}
          friendCards={friendCards}
        />
      )}

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white shadow-lg p-10 rounded relative">
            <p className="ext-lg font-semibold text-gray-700">
              Back to dashboard
            </p>
            <div className="absolute bottom-2 right-2 flex space-x-2 ">
              <button
                className="px-3 py-1 text-xs font-medium rounded border border-blue-500 bg-blue-500 text-white hover:bg-blue-400"
                onClick={handleBackToDashboard}
              >
                OK
              </button>
              <button
                className="px-3 py-1 text-xs font-medium rounded border border-red-500 bg-red-500 text-white hover:bg-red-400"
                onClick={() => setIsPopupVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
