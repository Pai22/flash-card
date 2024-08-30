// app/Card/components/LayoutCard.js
"use client";
import { useState, useEffect } from "react";
import { Switch, Input } from "@nextui-org/react";
import styles from "../CreateCard.module.css";
import useAuth from "@/app/lip/hooks/useAuth";

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
    if (file && file.type.startsWith('image/')) {
      setter(file)
    } else {
      alert('กรุณาเลือกไฟล์ภาพเท่านั้น');
    }
  };

  const handleButton = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImageFrontURL(url);
    } else {
      alert('กรุณาเลือกไฟล์ภาพเท่านั้น');
    }
  }


  const handleAudioChange = (setter) => (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setter(file);
    } else {
      alert('กรุณาเลือกไฟล์เสียงเท่านั้น');
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

  const cards = {
    front: [
      { id: 1, type: "text" },
      { id: 2, type: "image" },
      {
        id: 3,
        type: "TextImage",
        top: null,
        bottom: (
          <>
          <div className="bg-amber-400">
            <Input
              type="file"
              label="อัปโหลดรูปภาพ (ด้านหน้า)"
              accept="image/*"
              // onChange={handleFileChange(setImageFront)}
              variant=""
              fullWidth
              className=" m-10"
            />
            {imageFrontURL && (
              <div className="mt-2">
                <img
                  src={imageFrontURL}
                  alt="Image Front"
                  className="max-h-40"
                />
              </div>
            )}
            </div>
          </>
        ),
      },
      {
        id: 4,
        type: "ImageText",
        top: (
          <>
            <Input
              type="file"
              label="อัปโหลดรูปภาพ (ด้านหน้า)"
              accept="image/*"
              // onChange={handleFileChange(setImageFront)}
              variant="bordered"
              fullWidth
              className="mt-4"
            />
            {imageFrontURL && (
              <div className="mt-2">
                <img
                  src={imageFrontURL}
                  alt="Image Front"
                  className="max-h-40"
                />
              </div>
            )}
          </>
        ),
        bottom: null,
      },
    ],
    back: [
      { id: 5, type: "text" },
      { id: 6, type: "image" },
      {
        id: 7,
        type: "TextImage",
        top: null,
        bottom: (
          <>
            <Input
              type="file"
              label="อัปโหลดรูปภาพ (ด้านหลัง)"
              accept="image/*"
              // onChange={handleFileChange(setImageBack)}
              variant="bordered"
              fullWidth
              className="mt-4"
            />
            {imageBackURL && (
              <div className="mt-2">
                <img src={imageBackURL} alt="Image Back" className="max-h-40" />
              </div>
            )}
          </>
        ),
      },
      {
        id: 8,
        type: "ImageText",
        top: (
          <>
            <Input
              type="file"
              label="อัปโหลดรูปภาพ (ด้านหลัง)"
              accept="image/*"
              // onChange={handleFileChange(setImageBack)}
              variant="bordered"
              fullWidth
              className=" mt-4"
            />
            {imageBackURL && (
              <div className="mt-2">
                <img src={imageBackURL} alt="Image Back" className="max-h-40" />
              </div>
            )}
          </>
        ),
        bottom: null,
      },
    ],
  };
  
  const handleLayoutSelect = (side, layout) => {
    if (side === "front") {
      setLayoutFront(layout);
    } else {
      setLayoutBack(layout);
    }
  };

  const renderCard = (card, side) => (
    <div
      key={card.id}
      className="w-full bg-white shadow-md rounded-lg cursor-pointer"
      onClick={() => {
        if (side === "front") {
          setSelectedContentFront(card);
          handleLayoutSelect(side, card.type);
        } else {
          setSelectedContentBack(card);
          handleLayoutSelect(side, card.type);
        }
      }}
    >
      <div className=" bg-blue-300 rounded-lg flex items-center justify-center hover:bg-teal-400">
        <div>
          {card.type === "text" ? (
            <img src="/assets/TextIcon.png" alt="TextIcon" className="p-20 " />
          ) : card.type === "image" ? (
            <img src="/assets/ImageIcon.png" alt="ImageIcon" className="" />
          ) : card.type === "TextImage" ? (
            <div>
              <img src="/assets/TextIcon.png" alt="TextIcon" className="" />
              <img
                src="/assets/ImageIcon.png"
                alt="ImageIcon"
                className=""
              />
            </div>
          ) : (
            <div>
              <img
                src="/assets/ImageIcon.png"
                alt="ImageIcon"
                className=""
              />
              <img src="/assets/TextIcon.png" alt="TextIcon" className="" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSelectedCard = (selectedContent, side) => (
    <div
      className={`${
        styles[`flip-card-${side}`]
      } flex flex-col items-center justify-center `}
    >
      {selectedContent ? (
        selectedContent.type === "TextImage" ||
        selectedContent.type === "ImageText" ? (
          <>
            <div className=" flex items-center justify-center overflow-hidden">
              <div className="bg-yellow-400">
                {selectedContent.top === null ? (
                  <Input
                    autoFocus
                    label={`ข้อความ (ด้าน${
                      side === "front" ? "หน้า" : "หลัง"
                    })`}
                    name={`question${
                      side.charAt(0).toUpperCase() + side.slice(1)
                    }`}
                    value={side === "front" ? questionFront : questionBack}
                    onChange={(e) =>
                      side === "front"
                        ? setQuestionFront(e.target.value)
                        : setQuestionBack(e.target.value)
                    }
                    placeholder={`กรอกข้อความสำหรับด้าน${
                      side === "front" ? "หน้า" : "หลัง"
                    }`}
                    variant="bordered"
                    fullWidth
                  />
                ) : (
                  selectedContent.top
                )}
              </div>
            </div>
            <div className="border-t border-gray-300 mb-4"></div>
            <div className="flex flex-col items-center justify-center overflow-hidden">
            <div className="bg-green-400 p-10">

                {selectedContent.bottom === null ? (
                  <Input
                    autoFocus
                    label={`ข้อความ (ด้าน${
                      side === "front" ? "หน้า" : "หลัง"
                    })`}
                    name={`question${
                      side.charAt(0).toUpperCase() + side.slice(1)
                    }`}
                    value={side === "front" ? questionFront : questionBack}
                    onChange={(e) =>
                      side === "front"
                        ? setQuestionFront(e.target.value)
                        : setQuestionBack(e.target.value)
                    }
                    placeholder={`กรอกข้อความสำหรับด้าน${
                      side === "front" ? "หน้า" : "หลัง"
                    }`}
                    variant="bordered"
                    fullWidth
                  />
                ) : (
                  selectedContent.bottom
                )}
              </div>
            </div>
          </>
        ) : selectedContent.type === "text" ? (
          <div className="p-20 flex items-center justify-center overflow-hidden">
            <Input
              autoFocus
              label={` (ด้าน${side === "front" ? "หน้า" : "หลัง"})`}
              name={`question${side.charAt(0).toUpperCase() + side.slice(1)}`}
              value={side === "front" ? questionFront : questionBack}
              onChange={(e) =>
                side === "front"
                  ? setQuestionFront(e.target.value)
                  : setQuestionBack(e.target.value)
              }
              placeholder={`กรอกข้อความสำหรับด้าน${
                side === "front" ? "หน้า" : "หลัง"
              }`}
              variant="bordered"
              fullWidth
            />
          </div>
        ) : (
          <div className="p-20 flex items-center justify-center overflow-hidden">
            <div>
              <Input
                type="file"
                label={`อัปโหลดรูปภาพ (ด้าน${
                  side === "front" ? "หน้า" : "หลัง"
                })`}
                accept="image/*"
                onChange={
                  (handleFileChange(side === "front" ? setImageFront : setImageBack))
                }
                variant="bordered"
                fullWidth
                className="mt-4"
              />
              {(side === "front" ? imageFrontURL : imageBackURL) && (
                <div className="mt-2">
                  <img
                    src={side === "front" ? imageFrontURL : imageBackURL}
                    alt={`Image ${
                      side.charAt(0).toUpperCase() + side.slice(1)
                    }`}
                    className="max-h-40"
                  />
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        <p className={`${styles.title}`}>{`${side.toUpperCase()} SIDE`}</p>
      )}
      <div className="flex items-center justify-center">
        <Input
          type="file"
          label={`อัปโหลดไฟล์เสียง (ด้าน${side === "front" ? "หน้า" : "หลัง"})`}
          accept="audio/*"
          onChange={handleAudioChange(
            side === "front" ? setAudioFront : setAudioBack
          )}
          variant="bordered"
          fullWidth
          className="mt-4"
        />
        {(side === "front" ? audioFrontURL : audioBackURL) && (
          <div className="mt-2">
            <audio controls>
              <source src={side === "front" ? audioFrontURL : audioBackURL} type="audio/mpeg" />
            </audio>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-300">
      <div className="flex-1 p-4 bg-gray-200 flex items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {isSelected
            ? cards.back.map((card) => renderCard(card, "back") || layoutCard(card))
            : cards.front.map((card) => renderCard(card, "front") || layoutCard(card))}
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

            <input type="file" onChange={(e) => {handleButton(e)}}></input>
            <img src={imageFrontURL} className="max-h-40"/> 

            {/* {renderSelectedCard(
              isSelected ? selectedContentBack : selectedContentFront,
              isSelected ? "back" : "front"
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
