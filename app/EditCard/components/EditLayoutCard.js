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
  selectedCardId, // รับ ID ของการ์ดที่เลือกมาจาก Props
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
  const [selectedCardIdFront, setSelectedCardIdFront] = useState(null); // สถานะเก็บ ID ของการ์ดที่ถูกเลือกหน้า
  const [selectedCardIdBack, setSelectedCardIdBack] = useState(null); // สถานะเก็บ ID ของการ์ดที่ถูกเลือกหลัง
  const [isSelected, setIsSelected] = useState(false); // สถานะการเลือกหน้า
  const use = useAuth();
  // const [defaultLayout, setDefaultLayout] = useState(false);

  useEffect(() => {
    if (selectedCardId) {
      // ถ้าเป็นหน้า
      if (!isSelected) {
        setSelectedCardIdFront(selectedCardId); // ตั้งค่าหน้า
      } else {
        setSelectedCardIdBack(selectedCardId); // ตั้งค่าหลังถ้า isSelected เป็น true
      }
    }
  }, [selectedCardId, isSelected]); // เพิ่ม isSelected เพื่อให้สามารถตรวจสอบการเปลี่ยนแปลงได้

  useEffect(() => {
    setSelectedCardIdFront(layoutFront);
    console.log('Selected card',selectedCardIdFront);
    setSelectedCardIdBack(layoutBack);
    cards(
      imageUrlFront,
      handleFileChange,
      setImageFront,
      imageUrlBack,
      setImageBack
    ).front.map((card) => {
      // console.log(card.type)
      // console.log(selectedCardIdFront)
      if (layoutFront == card.type) {
        // console.log('ok')
      setSelectedContentFront(card)
      // handleLayoutSelect('front', selectedCardIdFront, setLayoutFront, setLayoutBack)
    }
    })
    cards(
      imageUrlFront,
      handleFileChange,
      setImageFront,
      imageUrlBack,
      setImageBack
    ).back.map((card) => {
      if (layoutBack == card.type) {
      setSelectedContentBack(card)
      // handleLayoutSelect('back', selectedCardIdBack, setLayoutFront, setLayoutBack)
    }
    })
  
    // console.log(layoutFront);
    // console.log(layoutBack);
  
    // handleLayoutSelect("front", layoutFront, setLayoutFront, setLayoutBack);
    // handleLayoutSelect('back', layoutBack, setLayoutFront, setLayoutBack);
   },[])

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

  // layoutCard 
  const renderCard = (card, side) => (
    <div
      key={card.id}
      className={`shadow-lg rounded-lg bg-white cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl ${
        side === "front" && selectedCardIdFront === card.type
          ? "ring-4 ring-yellow-500 bg-yellow-300"
          : side === "back" && selectedCardIdBack === card.type
          ? "ring-4 ring-yellow-500 bg-yellow-300"
          : ""
      }`}
      onClick={() => {
        if (side === "front") {
          setSelectedContentFront(card);
          setSelectedCardIdFront(card.type);  // เลือกการ์ดหน้า
          handleLayoutSelect(side, card.type, setLayoutFront, setLayoutBack);
        } else {
          setSelectedContentBack(card);
          setSelectedCardIdBack(card.type);  // เลือกการ์ดหน้า
          handleLayoutSelect(side, card.type, setLayoutFront, setLayoutBack);
        }
      }}
      // onLoad={renderCardLoad}
    >
      {card.type === "text" ? (
        <div className="min-h-48 min-w-48 flex items-center justify-center p-4 rounded-lg">
          <img
            src="/assets/TextIcon.png"
            alt="TextIcon"
            className="w-12 h-12"
          />
        </div>
      ) : card.type === "image" ? (
        <div className="min-h-48 min-w-48 flex items-center justify-center p-4 rounded-lg">
          <img
            src="/assets/ImageIcon.png"
            alt="ImageIcon"
            className="w-12 h-12"
          />
        </div>
      ) : card.type === "TextImage" ? (
        <div className="min-h-48 min-w-48 flex flex-col items-center justify-center  p-4 rounded-lg">
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
        <div className="min-h-48 min-w-48 flex flex-col items-center justify-center  p-4 rounded-lg">
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
  // console.log("qqq" + questionFront);
  return (
    <>
      <div className="bg-gray-200">
        <div className="flex flex-col items-center justify-center text-center overflow-hidden p-10 font-mono text-xl font-medium">
          แก้ไขการ์ดใบที่ {numberCard}
          <div className="grid grid-cols-2 items-center justify-center gap-4 mt-10">
            {isSelected
              ? cards(
                  imageUrlFront,
                  handleFileChange,
                  setImageFront,
                  imageUrlBack,
                  setImageBack
                ).back.map((card) => 
                  // Check if selectedCardIdFront matches card.type
                  // console.log("SDFGSDFGDSF")
                  // console.log(card.type)
                  // console.log("selectedCardIdBack",selectedCardIdBack)
                  // if (selectedCardIdBack == card.type) {
                  //   console.log("ok")
                  //   handleLayoutSelect('back', card.type, setLayoutFront, setLayoutBack);
                    // setSelectedContentBack(card);

                  //   return renderCard(card, "back");

                  // }
                  renderCard(card, "back"))
                // ).back.map((card) => renderCard(card, "back"))
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
                color="primary"
                onClick={saveEditedCard}
                disabled={loading}
                className=" font-mono text-white font-semibold"
              >
                {loading ? "กำลังบันทึก..." : "Save Changes"}
              </Button>
            </div>
          </div>
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
        </div>
      </div>
    </>
  );
}
