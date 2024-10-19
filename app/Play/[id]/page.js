// app/Play/[id]/page.js
"use client"
import React, { useState, useEffect } from "react";
import useAuth from "../../lip/hooks/useAuth";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { fetchCards } from "../components/useFirebase";
import Popup from "../components/Popup";
import GameView from "../components/GameView";


// ฟังก์ชันเพื่อสุ่มลำดับของการ์ด
const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

export default function Play() {
    const { id: deckId } = useParams();
    const searchParams = useSearchParams();
    const Title = searchParams.get('Title');
    const friendCards = searchParams.get('friendCards');
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

    useEffect(() => {
        if (auth && deckId) {
            return fetchCards(deckId,friendCards,auth, (fetchedCards) => {
                // สุ่มลำดับการ์ดก่อนบันทึกใน state
                const shuffledCards = shuffleArray(fetchedCards);
                setCards(shuffledCards);
                setCardCount(shuffledCards.length);
            }, setCardCount, setLoading);
        }
    }, [auth, deckId]);
    
    if (loading) {
        return <div>กำลังโหลด...</div>;
    }

    const currentCard = cards[currentCardIndex];

    const handleClick = () => {
        setIsFlipped(!isFlipped);
    };

    // const handleNextCard = () => {
    //     if (currentCardIndex < cardCount - 1 && currentCardIndex < cards.length - 1) {
    //         setCurrentCardIndex(currentCardIndex + 1);
    //         setIsFlipped(startSide === "Back");
    //     }
    // };

    const handleNextCard = () => {
        if (currentCardIndex < cardCount - 1 && currentCardIndex < cards.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1);
        //   รักษาสถานะการพลิกการ์ดตาม startSide
          if (startSide === "Back") {
            setIsFlipped(true); // เปลี่ยนไปที่ด้านหลัง
          } else {
            setIsFlipped(false); // เปลี่ยนไปที่ด้านหน้า
          }
        }
      };

    // const handlePreviousCard = () => {
    //     if (currentCardIndex > 0) {
    //         setCurrentCardIndex(currentCardIndex - 1);
    //         setIsFlipped(startSide === "Back");
    //     }
    // };

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
      alert("Exit");
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
        </div>
    );
}
