// app/Play/[id]/page.js
"use client";
import React, { useState, useEffect } from "react";
import useAuth from "../../lip/hooks/useAuth";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { fetchCards } from "../components/useFirebase";
import Popup from "../components/Popup";
import GameView from "../components/GameView";

export default function Play() {
    const { id: deckId } = useParams();
    const searchParams = useSearchParams();
    const Title = searchParams.get('Title');
    const [cards, setCards] = useState([]);
    const auth = useAuth();
    const [isFlipped, setIsFlipped] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0); // จัดการ index ของการ์ดปัจจุบัน
    const [showPopup, setShowPopup] = useState(true);
    const [mode, setMode] = useState("Single");
    const [startSide, setStartSide] = useState("Front");
    const [cardCount, setCardCount] = useState(0);

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [cardsQueue, setCardsQueue] = useState([]);

    useEffect(() => {
        if (auth && deckId) {
            return fetchCards(deckId, auth, setCards, setCardCount, setLoading);
        }
    }, [auth, deckId]);

    useEffect(() => {
        console.log("Title from searchParams:", Title);
    }, [Title]);
    
    

    // useEffect(() => {
        // ถ้าตอบผิดจะเพิ่มการ์ดลงใน queue
    //     if (cardsQueue.length > 0) {
    //         setCurrentCardIndex(cards.indexOf(cardsQueue[0]));
    //         setCardsQueue(cardsQueue.slice(1));
    //     }
    // }, [cardsQueue]);

    useEffect(() => {
        if (cardsQueue.length > 0) {
            const nextCard = cardsQueue[0];
            setCurrentCardIndex(cards.findIndex(card => card.id === nextCard.id));
            setCardsQueue(cardsQueue.slice(1)); // ลบการ์ดแรกออกจาก queue หลังแสดง
        }
    }, [cardsQueue]);
    
    // console.log(cardsQueue); // ตรวจสอบคิวการ์ด
    // console.log(currentCardIndex); // ตรวจสอบดัชนีของการ์ดปัจจุบัน

    

    if (loading) {
        return <div>กำลังโหลด...</div>;
    }

    const currentCard = cards[currentCardIndex];

    const handleClick = () => {
        setIsFlipped(!isFlipped);
    };

    const handleNextCard = () => {
        if (currentCardIndex < cardCount - 1 && currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(startSide === "Back");
        }
    };

    const handlePreviousCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setIsFlipped(startSide === "Back");
        }
    };

    const handleExit = () => {
        router.push("/dashboard");
    };

    const handleStart = () => {
        setShowPopup(false);
        setIsFlipped(startSide === "Back");
        console.log("Starting game..."); // เพิ่มการตรวจสอบว่าฟังก์ชันถูกเรียกหรือไม่
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
                    cardsQueue={cardsQueue}
                    setCardsQueue={setCardsQueue}
                    setCurrentCardIndex={setCurrentCardIndex}
                    Title={Title}
                />
            )}
        </div>
    );
}