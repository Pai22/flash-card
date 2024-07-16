// app/Card/components/LayoutCard.js
"use client";
import { useState } from "react";
import { Textarea, Image, Switch } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import styles from "../CreateCard.module.css";

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
}) {
  const [selectedContentFront, setSelectedContentFront] = useState(null);
  const [selectedContentBack, setSelectedContentBack] = useState(null);
  const [isSelected, setIsSelected] = useState(false);

  const handleImageBackChange = (e) => {
    const file = e.target.files[0];
    setImageBack(file);
  };

  const handleAudioBackChange = (e) => {
    const file = e.target.files[0];
    setAudioBack(file);
  };

  const handleImageFrontChange = (e) => {
    const file = e.target.files[0];
    setImageFront(file);
  };

  const handleAudioFrontChange = (e) => {
    const file = e.target.files[0];
    setAudioFront(file);
  };

  // Separate cards into cardsFront and cardsBack
  const cardsFront = [
    { id: 1, type: "text" },
    {
      id: 2,
      type: "image",
      content:
        "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg",
    },
    {
      id: 3,
      type: "mixed",
      top: (
        <Textarea
          label=""
          variant="bordered"
          labelPlacement="outside"
          placeholder="Aa"
          defaultValue=""
          className="max-w-xs"
        />
      ),
      bottom:
        "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg",
    },
    {
      id: 4,
      type: "mixed",
      top: "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg",
      bottom: (
        <Textarea
          label=""
          variant="bordered"
          labelPlacement="outside"
          placeholder="Aa"
          defaultValue=""
          className="max-w-xs"
        />
      ),
    },
  ];

  const cardsBack = [
    { id: 5, type: "text" },
    {
      id: 6,
      type: "image",
      content:
        "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg",
    },
    {
      id: 7,
      type: "mixed",
      top: (
        <Textarea
          label=""
          variant="bordered"
          labelPlacement="outside"
          placeholder="Aa"
          defaultValue=""
          className="max-w-xs"
        />
      ),
      bottom:
        "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg",
    },
    {
      id: 8,
      type: "mixed",
      top: "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg",
      bottom: (
        <Textarea
          label=""
          variant="bordered"
          labelPlacement="outside"
          placeholder="Aa"
          defaultValue=""
          className="max-w-xs"
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex min-h-screen bg-gray-300">
        {/* Left Side */}
        <div className="flex-1 p-4 bg-gray-200 flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isSelected
              ? cardsBack.map((card) => (
                  <div
                    key={card.id}
                    className="w-full bg-white shadow-md rounded-lg cursor-pointer"
                    onClick={() => setSelectedContentBack(card)}
                  >
                    <div className="p-20 flex items-center justify-center overflow-hidden">
                      <div>{card.type === "text" ? "TEXT" : "IMAGE/MIXED"}</div>
                    </div>
                  </div>
                ))
              : cardsFront.map((card) => (
                  <div
                    key={card.id}
                    className="w-full bg-white shadow-md rounded-lg cursor-pointer"
                    onClick={() => setSelectedContentFront(card)}
                  >
                    <div className="p-20 flex items-center justify-center overflow-hidden">
                      <div>{card.type === "text" ? "TEXT" : "IMAGE/MIXED"}</div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 bg-gray-300 flex flex-col items-center justify-center">
          <Switch
            isSelected={isSelected}
            onValueChange={() => setIsSelected(!isSelected)}
            color="secondary"
          />

          <p className="text-small text-default-500 text-center">
            Selected: {isSelected ? "Back" : "Front"}
          </p>
          <div
            className={`container mx-auto max-w-full  ${styles["flip-card"]}`}
          >
            <div
              className={`${styles["flip-card-inner"]} ${
                isSelected ? styles["flipped"] : ""
              }`}
            >
              {!isSelected ? (
                <div
                  className={`${styles["flip-card-front"]} flex flex-col items-center justify-center`}
                >
                  {selectedContentFront ? (
                    selectedContentFront.type === "mixed" ? (
                      <>
                        <div className="p-10 flex items-center justify-center overflow-hidden">
                          <div>
                            {typeof selectedContentFront.top === "string" ? (
                              <Image
                                width={300}
                                alt="NextUI hero Image"
                                src={selectedContentFront.top}
                              />
                            ) : (
                              selectedContentFront.top
                            )}
                          </div>
                        </div>
                        <div className="border-t border-gray-200"></div>
                        <div className="p-10 flex items-center justify-center overflow-hidden">
                          <div>
                            {typeof selectedContentFront.bottom === "string" ? (
                              <Image
                                width={300}
                                alt="NextUI hero Image"
                                src={selectedContentFront.bottom}
                              />
                            ) : (
                              selectedContentFront.bottom
                            )}
                          </div>
                        </div>
                      </>
                    ) : selectedContentFront.type === "text" ? (
                      <div className="p-20 flex items-center justify-center overflow-hidden">
                        <Input
                          autoFocus
                          label="คำถาม (ด้านหน้า)"
                          name="questionFront"
                          value={questionFront}
                          onChange={(e) => setQuestionFront(e.target.value)}
                          placeholder="กรอกคำถามสำหรับด้านหน้า"
                          variant="bordered"
                          fullWidth
                        />
                      </div>
                    ) : (
                      <div className="p-20 flex items-center justify-center overflow-hidden">
                        <div>
                          <Input
                            type="file"
                            label="อัปโหลดรูปภาพ (ด้านหน้า)"
                            accept="image/*"
                            onChange={handleImageFrontChange}
                            variant="bordered"
                            fullWidth
                            className="mt-4"
                          />
                          {imageFront && (
                            <div className="mt-2">
                              <img
                                src={URL.createObjectURL(imageFront)}
                                alt="Image Front"
                                className="max-h-40"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    <p className={`${styles.title}`}>FRONT SIDE</p>
                  )}
                </div>
              ) : (
                <div
                  className={`${styles["flip-card-back"]} flex flex-col items-center justify-center`}
                >
                  {selectedContentBack ? (
                    selectedContentBack.type === "mixed" ? (
                      <>
                        <div className="p-10 flex items-center justify-center overflow-hidden">
                          <div>
                            {typeof selectedContentBack.bottom === "string" ? (
                              <Image
                                width={300}
                                alt="NextUI hero Image"
                                src={selectedContentBack.bottom}
                              />
                            ) : (
                              selectedContentBack.bottom
                            )}
                          </div>
                        </div>
                        <div className="border-t border-gray-200"></div>
                        <div className="p-10 flex items-center justify-center overflow-hidden">
                          <div>
                            {typeof selectedContentBack.top === "string" ? (
                              <Image
                                width={300}
                                alt="NextUI hero Image"
                                src={selectedContentBack.top}
                              />
                            ) : (
                              selectedContentBack.top
                            )}
                          </div>
                        </div>
                      </>
                    ) : selectedContentBack.type === "text" ? (
                      <div className="p-20 flex items-center justify-center overflow-hidden">
                        <Textarea
                          label=""
                          variant="bordered"
                          labelPlacement="outside"
                          placeholder="Aa"
                          defaultValue=""
                          className="max-w-xs"
                        />
                      </div>
                    ) : (
                      <div className="p-20 flex items-center justify-center overflow-hidden">
                        <div>
                          <Image
                            width={300}
                            alt="NextUI hero Image"
                            src={selectedContentBack.content}
                          />
                        </div>
                      </div>
                    )
                  ) : (
                    <p className={`${styles.title}`}>BACK SIDE</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
