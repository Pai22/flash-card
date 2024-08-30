// app/Card/components/LayoutCard.js
"use client";
import { useState, useEffect } from "react";
import { Switch} from "@nextui-org/react";
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
  setLayoutBack,
  setLayoutFront,
  resetState,
  loading,
}) {
  const [selectedContentFront, setSelectedContentFront] = useState(null);
  const [selectedContentBack, setSelectedContentBack] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [imageFrontURL, setImageFrontURL] = useState(null);
  const [imageBackURL, setImageBackURL] = useState(null);
  const [audioFrontURL, setAudioFrontURL] = useState(null);
  const [audioBackURL, setAudioBackURL] = useState(null);
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
      setImageFrontURL(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFront]);

  useEffect(() => {
    if (imageBack) {
      const url = URL.createObjectURL(imageBack);
      setImageBackURL(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageBack]);

  useEffect(() => {
    if (audioFront) {
      const url = URL.createObjectURL(audioFront);
      setAudioFrontURL(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioFront]);

  useEffect(() => {
    if (audioBack) {
      const url = URL.createObjectURL(audioBack);
      setAudioBackURL(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBack]);

 

  useEffect(() => {
  if (!loading) {
    setSelectedContentFront(null);
    setSelectedContentBack(null);
    setIsSelected(false);
    setImageFrontURL(null);
    setImageBackURL(null);
    setAudioFrontURL(null);
    setAudioBackURL(null);
    setImageFront(null);
    setAudioFront(null);
    setImageBack(null);
    setAudioBack(null);
    setQuestionFront("");
    setQuestionBack("");
    setLayoutFront("");
    setLayoutBack("");
    
  }
}, [loading]);

  const renderCard = (card, side) => (
    <div
      key={card.id}
      className="w-full bg-white shadow-md rounded-lg cursor-pointer"
      onClick={() => {
        if (side === "front") {
          setSelectedContentFront(card);
          handleLayoutSelect(side, card.type,setLayoutFront, setLayoutBack);
        } else {
          setSelectedContentBack(card);
          handleLayoutSelect(side, card.type,setLayoutFront, setLayoutBack);
        }
      }}
    >
      <div className="p-20 flex items-center justify-center overflow-hidden">
        <div>
          {card.type === "text" ? (
            <img src="/assets/TextIcon.png" alt="TextIcon" className="w-20" />
          ) : card.type === "image" ? (
            <img src="/assets/ImageIcon.png" alt="ImageIcon" className="w-20" />
          ) : card.type === "TextImage" ? (
            <div>
              <img src="/assets/TextIcon.png" alt="TextIcon" className="w-20" />
              <img
                src="/assets/ImageIcon.png"
                alt="ImageIcon"
                className="w-20"
              />
            </div>
          ) : (
            <div>
              <img
                src="/assets/ImageIcon.png"
                alt="ImageIcon"
                className="w-20"
              />
              <img src="/assets/TextIcon.png" alt="TextIcon" className="w-20" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-300">
      <div className="flex-1 p-4 bg-gray-200 flex items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isSelected
            ? cards(imageFrontURL, handleFileChange, setImageFront, imageBackURL, setImageBack).back.map((card) =>
              renderCard(card, "back"))
            : cards(imageFrontURL, handleFileChange, setImageFront, imageBackURL, setImageBack).front.map((card) =>
              renderCard(card, "front"))
          }
        </div>
      </div>
      <div className="flex-1 bg-gray-300 flex flex-col items-center justify-center">
        <Switch
          isSelected={isSelected}
          onValueChange={() => setIsSelected(!isSelected)}
          color="secondary"
        />
        <p className="text-small text-default-500 text-center">
          Selected: {isSelected ? "Back" : "Front"}
        </p>
        <div className={`container mx-auto max-w-full ${styles["flip-card"]}`}>
          <div
            className={`${styles["flip-card-inner"]} ${
              isSelected ? styles["flipped"] : ""
            }`}
          >
            <RenderSelectedCard
            selectedContent = {isSelected ? selectedContentBack : selectedContentFront}
            side = {isSelected ? "back" : "front"}
            questionFront = {questionFront}
            questionBack = {questionBack}
            setQuestionFront = {setQuestionFront}
            setQuestionBack = {setQuestionBack}
            imageFrontURL = {imageFrontURL}
            imageBackURL = {imageBackURL}
            handleFileChange = {handleFileChange}
            handleAudioChange = {handleAudioChange}
            setImageFront = {setImageFront}
            setImageBack = {setImageBack}
            setAudioFront = {setAudioFront}
            setAudioBack = {setAudioBack}
            audioFrontURL = {audioFrontURL}
            audioBackURL  = {audioBackURL}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
