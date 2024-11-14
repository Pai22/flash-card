// app/Card/components/LayoutCard.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Switch, Button } from "@nextui-org/react";
import RenderSelectedCard from "./RenderSelectedCard";
import styles from "../CreateCard.module.css";
import useAuth from "@/app/lip/hooks/useAuth";
import { cards, handleLayoutSelect } from "./cardLayoutUtils";

export default function LayoutCard({
  deckId,
  setQuestionBack,
  setImageBack,
  setAudioBack,
  questionBack,
  imageBack,
  audioBack,
  setQuestionFront,
  setImageFront,
  setAudioFront,
  questionFront,
  imageFront,
  audioFront,
  imageUrlFront,
  imageUrlBack,
  audioUrlFront,
  audioUrlBack,
  setLayoutBack,
  setLayoutFront,
  loading,
  setImageUrlFront,
  setImageUrlBack,
  setAudioUrlFront,
  setAudioUrlBack,
  addCardToDeck,
}) {
  const [selectedContentFront, setSelectedContentFront] = useState(null);
  const [selectedContentBack, setSelectedContentBack] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedCardIdFront, setSelectedCardIdFront] = useState(null); // เก็บสถานะการเลือกการ์ดด้านหน้า
  const [selectedCardIdBack, setSelectedCardIdBack] = useState(null);  // เก็บสถานะการเลือกการ์ดด้านหลัง state to track the selected card ID
  const use = useAuth();


  
  const handleFileChange = (setter) => (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setter(file);
    } else {
      alert("กรุณาเลือกไฟล์ภาพเท่านั้น");
    }
  };

  const handleAudioChange = (setter) => (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("audio/")) {
      setter(file);
    } else {
      alert("กรุณาเลือกไฟล์เสียงเท่านั้น");
    }
  };

  useEffect(() => {
    if (imageFront) {
      const url = URL.createObjectURL(imageFront);
      setImageUrlFront(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFront]);

  useEffect(() => {
    if (imageBack) {
      const url = URL.createObjectURL(imageBack);
      setImageUrlBack(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageBack]);

  useEffect(() => {
    if (audioFront) {
      const url = URL.createObjectURL(audioFront);
      setAudioUrlFront(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioFront]);

  useEffect(() => {
    if (audioBack) {
      const url = URL.createObjectURL(audioBack);
      setAudioUrlBack(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBack]);

  useEffect(() => {
    if (!loading) {
      setSelectedContentFront(null);
      setSelectedContentBack(null);
      setIsSelected(false);
      setImageUrlFront(null);
      setImageUrlBack(null);
      setAudioUrlFront(null);
      setAudioUrlBack(null);
      setImageFront(null);
      setAudioFront(null);
      setImageBack(null);
      setAudioBack(null);
      setQuestionFront("");
      setQuestionBack("");
      setLayoutFront("");
      setLayoutBack("");
      setSelectedCardIdFront(null); // รีเซ็ตการเลือกการ์ดด้านหน้า
      setSelectedCardIdBack(null);  // รีเซ็ตการเลือกการ์ดด้านหลัง
    }
  }, [loading]);

  const renderCard = (card, side) => (
    <div
    key={card.id}
    className={`bg-gray-100 shadow-lg rounded-lg cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl ${
      side === "front" && selectedCardIdFront === card.id
        ? "ring-4 ring-sky-400"
        : side === "back" && selectedCardIdBack === card.id
        ? "ring-4 ring-sky-400"
        : ""
    }`} // เพิ่มเงื่อนไขการเลือกการ์ด
    onClick={() => {
      if (side === "front") {
        setSelectedCardIdFront(card.id); // อัปเดตการเลือกการ์ดด้านหน้า
        setSelectedContentFront(card);
        handleLayoutSelect(side, card.type, setLayoutFront, setLayoutBack);
      } else {
        setSelectedCardIdBack(card.id); // อัปเดตการเลือกการ์ดด้านหลัง
        setSelectedContentBack(card);
        handleLayoutSelect(side, card.type, setLayoutFront, setLayoutBack);
      }
    }}
  >
      {card.type === "text" ? (
        <div
          className={`min-h-48 min-w-48 flex items-center justify-center p-4 rounded-lg ${
            selectedCardIdFront === card.id || selectedCardIdBack === card.id ? "bg-sky-300" : ""
          }`}
        >
          <img
            src="/assets/TextIcon.png"
            alt="TextIcon"
            className="w-12 h-12"
          />
        </div>
      ) : card.type === "image" ? (
        <div
          className={`min-h-48 min-w-48 flex items-center justify-center p-4 rounded-lg ${
            selectedCardIdFront === card.id || selectedCardIdBack === card.id ? "bg-sky-300" : ""
          }`}
        >
          <img
            src="/assets/ImageIcon.png"
            alt="ImageIcon"
            className="w-12 h-12"
          />
        </div>
      ) : card.type === "TextImage" ? (
        <div
          className={`min-h-48 min-w-48 flex flex-col items-center justify-center  p-4 rounded-lg ${
            selectedCardIdFront === card.id || selectedCardIdBack === card.id ? "bg-sky-300" : ""
          }`}
        >
          <div className="mb-2">
            <img
              src="/assets/TextIcon.png"
              alt="TextIcon"
              className="w-12 h-12"
            />
          </div>
          <div>
            <img
              src="/assets/ImageIcon.png"
              alt="ImageIcon"
              className="w-12 h-12"
            />
          </div>
        </div>
      ) : (
        <div
          className={`min-h-48 min-w-48 flex flex-col items-center justify-center  p-4 rounded-lg ${
            selectedCardIdFront === card.id || selectedCardIdBack === card.id ? "bg-sky-300" : ""
          }`}
        >
          <div className="mb-2">
            <img
              src="/assets/ImageIcon.png"
              alt="ImageIcon"
              className="w-12 h-12"
            />
          </div>
          <div>
            <img
              src="/assets/TextIcon.png"
              alt="TextIcon"
              className="w-12 h-12"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className=" bg-gray-200 ">
        <div className="flex flex-col items-center justify-center text-center overflow-hidden p-10 text-lg ">
          Choose the template
          <div className="grid grid-cols-2 items-center justify-center gap-4 mt-10">
            {isSelected
              ? cards(
                  imageUrlFront,
                  handleFileChange,
                  setImageFront,
                  imageUrlBack,
                  setImageBack
                ).back.map((card) => renderCard(card, "back"))
              : cards(
                  imageUrlFront,
                  handleFileChange,
                  setImageFront,
                  imageUrlBack,
                  setImageBack
                ).front.map((card) => renderCard(card, "front"))}
                
          </div>
        </div>
      </div>

      <div className="bg-gray-300 flex justify-center p-5">
        <div className="grid grid-flow-row justify-items-center">
          <div className="grid grid-cols-3 gap-4 items-center">
            <div></div>
            <div className="flex justify-center">
              <Switch
                isSelected={isSelected}
                onValueChange={() => setIsSelected(!isSelected)}
                color="secondary"
              />
            </div>
            <div className="pl-16">
              <Button
                color="success"
                onClick={addCardToDeck}
                disabled={loading}
                className="font-mono text-white font-semibold"
              >
                {loading ? "กำลังบันทึก..." : "Add Card"}
              </Button>
            </div>
          </div>
          <p className="text-small text-default-500 text-center">
            Selected: {isSelected ? "Back" : "Front"}
          </p>
          <div
            className={`container mx-auto max-w-full ${styles["flip-card"]}`}
          >
            <div
              className={`${styles["flip-card-inner"]} ${
                isSelected ? styles["flipped"] : ""
              }`}
            >
              <RenderSelectedCard
                selectedContent={
                  isSelected ? selectedContentBack : selectedContentFront
                }
                side={isSelected ? "back" : "front"}
                questionFront={questionFront}
                questionBack={questionBack}
                setQuestionFront={setQuestionFront}
                setQuestionBack={setQuestionBack}
                imageUrlFront={imageUrlFront}
                imageUrlBack={imageUrlBack}
                handleFileChange={handleFileChange}
                handleAudioChange={handleAudioChange}
                setImageFront={setImageFront}
                setImageBack={setImageBack}
                setAudioFront={setAudioFront}
                setAudioBack={setAudioBack}
                audioUrlFront={audioUrlFront}
                audioUrlBack={audioUrlBack}
                selectedCardId={isSelected ? selectedCardIdBack : selectedCardIdFront} // ส่ง ID ของการ์ดที่เลือก
                
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
