// app/EditCard/components/LayoutCardEdit.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Switch, Button } from "@nextui-org/react";
import RenderSelectedCardEdit from "./RenderSelectedCard";
import styles from "../../Card/CreateCard.module.css";
import useAuth from "@/app/lip/hooks/useAuth";
import {
  cards,
  handleLayoutSelect,
} from "../../Card/components/cardLayoutUtils";

export default function LayoutCardEdit({
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
  layoutBack,
  setLayoutFront,
  layoutFront,
  loading,
  setImageUrlFront,
  setImageUrlBack,
  setAudioUrlFront,
  setAudioUrlBack,
  saveEditedCard,
  numberCard,
  cardId,
  setLoading,
}) {
  const [selectedContentFront, setSelectedContentFront] = useState(null);
  const [selectedContentBack, setSelectedContentBack] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const use = useAuth();
  const router = useRouter();

  const handleFileChange = (setter) => (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setter(file);
      } else {
        alert("กรุณาเลือกไฟล์ภาพเท่านั้น");
      }
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

  // ล้าง URL ของ image ที่ถูกสร้างขึ้นก่อนหน้า
  useEffect(() => {
    let url;
    if (imageFront) {
      url = URL.createObjectURL(imageFront);
      setImageUrlFront(url);
    }
    return () => {
      if (url) URL.revokeObjectURL(url); // ล้าง Object URL ที่ถูกสร้าง
    };
  }, [imageFront, setImageUrlFront]);

  useEffect(() => {
    let url;
    if (imageBack) {
      url = URL.createObjectURL(imageBack);
      setImageUrlBack(url);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [imageBack, setImageUrlBack]);

  useEffect(() => {
    let url;
    if (audioFront) {
      url = URL.createObjectURL(audioFront);
      setAudioUrlFront(url);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [audioFront, setAudioUrlFront]);

  useEffect(() => {
    let url;
    if (audioBack) {
      url = URL.createObjectURL(audioBack);
      setAudioUrlBack(url);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [audioBack, setAudioUrlBack]);

   


  const renderCard = (card, side) => (
    <div
      key={card.id}
      className="bg-white shadow-lg rounded-lg cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl"
      onClick={() => {
        if (side === "front") {
          setSelectedContentFront(card);
          handleLayoutSelect(side, card.type, setLayoutFront, setLayoutBack);
        } else {
          setSelectedContentBack(card);
          handleLayoutSelect(side, card.type, setLayoutFront, setLayoutBack);
        }
      }}
    >
      {card.type === "text" ? (
        <div className="min-h-48 min-w-48 flex items-center justify-center bg-gray-100 p-4 rounded-lg">
          <img
            src="/assets/TextIcon.png"
            alt="TextIcon"
            className="w-12 h-12"
          />
        </div>
      ) : card.type === "image" ? (
        <div className="min-h-48 min-w-48 flex items-center justify-center bg-gray-100 p-4 rounded-lg">
          <img
            src="/assets/ImageIcon.png"
            alt="ImageIcon"
            className="w-12 h-12"
          />
        </div>
      ) : card.type === "TextImage" ? (
        <div className="min-h-48 min-w-48 flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg">
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
        <div className="min-h-48 min-w-48 flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg">
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
  console.log("qqq"+questionFront)
  return (
    <>
      <div className="bg-gray-200">
        <div className="flex flex-col items-center justify-center text-center overflow-hidden p-10">
          แก้ไขการ์ดใบที่ {numberCard}
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
          <Switch
            isSelected={isSelected}
            onValueChange={() => setIsSelected(!isSelected)}
            color="secondary"
          />
          <p className="text-small text-default-500 text-center">
            {isSelected ? "Back" : "Front"}
          </p>

          <div
            className={`container mx-auto max-w-full ${styles["flip-card"]}`}
          >
            <div
              className={`${styles["flip-card-inner"]} ${
                isSelected ? styles["flipped"] : ""
              }`}
            >
              <RenderSelectedCardEdit
                selectedContent={
                  isSelected ? selectedContentBack : selectedContentFront
                }
                side={isSelected ? "back" : "front"}
                questionFront={questionFront}
                questionBack={questionBack}
                setQuestionFront={setQuestionFront}
                setQuestionBack={setQuestionBack}
                layoutFront={layoutFront}
                layoutBack={layoutBack}
                setLayoutBack={setLayoutBack}
                setLayoutFront={setLayoutFront}
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
                cardId={cardId}
              />
            </div>
          </div>
          
          <div className="mt-5">
            <Button color="primary" onClick={saveEditedCard} disabled={loading}>
              {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
