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
  deleteFile,
}) {
  const [selectedContentFront, setSelectedContentFront] = useState(null);
  const [selectedContentBack, setSelectedContentBack] = useState(null);
  const [selectedCardIdFront, setSelectedCardIdFront] = useState(null); // สถานะเก็บ ID ของการ์ดที่ถูกเลือกหน้า
  const [selectedCardIdBack, setSelectedCardIdBack] = useState(null); // สถานะเก็บ ID ของการ์ดที่ถูกเลือกหลัง
  const [isSelected, setIsSelected] = useState(false); // สถานะการเลือกหน้า
  const use = useAuth();

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
    console.log("Selected card", selectedCardIdFront);
    setSelectedCardIdBack(layoutBack);
    cards(
      imageUrlFront,
      handleFileChange,
      setImageFront,
      imageUrlBack,
      setImageBack
    ).front.map((card) => {
      if (layoutFront == card.type) {
        setSelectedContentFront(card);
      }
    });
    cards(
      imageUrlFront,
      handleFileChange,
      setImageFront,
      imageUrlBack,
      setImageBack
    ).back.map((card) => {
      if (layoutBack == card.type) {
        setSelectedContentBack(card);
      }
    });
  }, []);

  const handleFileChange = (side) => (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (side === "front" && imageUrlFront) {
        alert("กรุณาลบภาพด้านหน้าก่อนอัปโหลดภาพใหม่");
        e.target.value = ""; // รีเซ็ตค่า input file
        return;
      }
      
      if (side === "back" && imageUrlBack) {
        alert("กรุณาลบภาพด้านหลังก่อนอัปโหลดภาพใหม่");
        e.target.value = ""; // รีเซ็ตค่า input file
        return;
      }
      
      // ตรวจสอบว่าไฟล์ที่อัปโหลดเป็นภาพ
      if (file && file.type.startsWith("image/")) {
        if (side === "front") {
          setImageFront(file);
          console.log(`ไฟล์ภาพด้านหน้า: ${file.name}`);
        } else if (side === "back") {
          setImageBack(file);
          console.log(`ไฟล์ภาพด้านหลัง: ${file.name}`);
        }
      } else {
        alert("กรุณาเลือกไฟล์ภาพเท่านั้น");
        e.target.value = ""; // รีเซ็ตค่า input file
      }
    }
  };

  const handleAudioChange = (side) => (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (side === "front" && audioUrlFront) {
        alert("กรุณาลบไฟล์เสียงด้านหน้าก่อนอัปโหลดไฟล์ใหม่");
        e.target.value = ""; // รีเซ็ตค่า input file
        return;
      }
      
      if (side === "back" && audioUrlBack) {
        alert("กรุณาลบไฟล์เสียงด้านหลังก่อนอัปโหลดไฟล์ใหม่");
        e.target.value = ""; // รีเซ็ตค่า input file
        return;
      }
      
      // ตั้งค่าไฟล์ตามด้าน
      if (file && file.type.startsWith("audio/")) {
        if (side === "front") {
          setAudioFront(file);
          console.log(`ไฟล์เสียงด้านหน้า: ${file.name}`);
        } else if (side === "back") {
          setAudioBack(file);
          console.log(`ไฟล์เสียงด้านหลัง: ${file.name}`);
        }
      } else {
        alert("กรุณาเลือกไฟล์เสียงเท่านั้น");
        e.target.value = ""; // รีเซ็ตค่า input file
      }
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
  }, [imageFront]);

  useEffect(() => {
    let url;
    if (imageBack) {
      url = URL.createObjectURL(imageBack);
      setImageUrlBack(url);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [imageBack]);

  useEffect(() => {
    let url;
    if (audioFront) {
      url = URL.createObjectURL(audioFront);
      setAudioUrlFront(url);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [audioFront]);

  useEffect(() => {
    let url;
    if (audioBack) {
      url = URL.createObjectURL(audioBack);
      setAudioUrlBack(url);
    }
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [audioBack]);

  // layoutCard
  const renderCard = (card, side) => (
    <div
      key={card.id}
      className={`shadow-lg rounded-lg bg-white cursor-pointer transform transition-transform hover:scale-105 hover:shadow-xl overflow-hidden ${
        side === "front" && selectedCardIdFront === card.type
          ? "ring-4 ring-yellow-500 bg-yellow-300"
          : side === "back" && selectedCardIdBack === card.type
          ? "ring-4 ring-yellow-500 bg-yellow-300"
          : ""
      }`}
      onClick={() => {
        if (side === "front") {
          setSelectedContentFront(card);
          setSelectedCardIdFront(card.type); // เลือกการ์ดหน้า
          handleLayoutSelect(side, card.type, setLayoutFront, setLayoutBack);
        } else {
          setSelectedContentBack(card);
          setSelectedCardIdBack(card.type); // เลือกการ์ดหน้า
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
  return (
    <>
      <div className="bg-gray-200">
        <div className="flex flex-col items-center justify-center text-center  p-10 font-mono text-xl ">
         <div>Choose the template</div><br></br>
          <p className="text-lg">Edit Card <span className="bg-white font-semibold border-2 py-2 px-3 rounded-lg">{numberCard}</span></p>
          <div className="grid grid-cols-1 xl:grid-cols-2 items-center justify-center gap-4 mt-10 ">
            {isSelected
              ? cards().back.map((card) => renderCard(card, "back"))
              : cards().front.map((card) => renderCard(card, "front"))}
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
          <p className="font-mono text-md text-default-500 text-center">
          Select : {isSelected ? "Back" : "Front"}
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
                setAudioUrlBack={setAudioUrlBack}
                setAudioUrlFront={setAudioUrlFront}
                setAudioBack={setAudioBack}
                audioUrlFront={audioUrlFront}
                audioUrlBack={audioUrlBack}
                cardId={cardId}
                deleteFile={deleteFile}
                setImageUrlBack={setImageUrlBack}
                setImageUrlFront={setImageUrlFront}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
