// app/EditCard/[id]/page.js
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import useAuth from "@/app/lip/hooks/useAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lip/firebase/clientApp";
import { Input, Button } from "@nextui-org/react";
import LayoutCardEdit from "../components/EditLayoutCard";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../lip/firebase/clientApp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const EditCard = () => {
  const { id: cardId } = useParams();
  const auth = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const deckId = searchParams.get("deckId");
  const numberCard = searchParams.get("numberCard");
  const title = searchParams.get("title");

  const [cardData, setCardData] = useState(null);
  const [questionFront, setQuestionFront] = useState("");
  const [questionBack, setQuestionBack] = useState("");
  const [imageFront, setImageFront] = useState(null);
  const [imageBack, setImageBack] = useState(null);
  const [audioFront, setAudioFront] = useState(null);
  const [audioBack, setAudioBack] = useState(null);
  const [imageUrlFront, setImageUrlFront] = useState("");
  const [imageUrlBack, setImageUrlBack] = useState("");
  const [audioUrlFront, setAudioUrlFront] = useState("");
  const [audioUrlBack, setAudioUrlBack] = useState("");
  const [layoutFront, setLayoutFront] = useState("");
  const [layoutBack, setLayoutBack] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch card data from Firestore
  useEffect(() => {
    const fetchCardData = async () => {
      if (!auth?.uid || !deckId || !cardId) return;

      try {
        const cardRef = doc(
          db,
          "Deck",
          auth.uid,
          "title",
          deckId,
          "cards",
          cardId
        );
        const cardSnap = await getDoc(cardRef);

        if (cardSnap.exists()) {
          const data = cardSnap.data();
          setCardData(data);
          setQuestionFront(data.questionFront || "");
          setQuestionBack(data.questionBack || "");
          setImageUrlFront(data.imageUrlFront || "");
          setImageUrlBack(data.imageUrlBack || "");
          setAudioUrlFront(data.audioUrlFront || "");
          setAudioUrlBack(data.audioUrlBack || "");
          setLayoutFront(data.layoutFront || "");
          setLayoutBack(data.layoutBack || "");
        } else {
          console.log("ไม่พบเอกสาร!");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการ์ด:", error);
      }
    };

    // ตรวจสอบว่า auth และค่าอื่นๆ ถูกต้องก่อนเรียก fetchCardData
    if (auth?.uid && deckId && cardId) {
      fetchCardData();
    }
  }, [auth, deckId, cardId]);

  // Function to upload files to Firebase Storage
  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  // Function to handle saving the edited card data
  const handleSave = async (e) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);

    try {
      let updatedImageUrlFront = imageUrlFront;
      let updatedImageUrlBack = imageUrlBack;
      let updatedAudioUrlFront = audioUrlFront;
      let updatedAudioUrlBack = audioUrlBack;

      // อัปโหลดไฟล์หากมีการเลือกใหม่
      if (imageFront) {
        updatedImageUrlFront = await uploadFile(
          imageFront,
           `images/${auth.uid}/ImageFront/${imageFront.name}`
        );
      }

      if (imageBack) {
        updatedImageUrlBack = await uploadFile(
          imageBack,
           `images/${auth.uid}/ImageBack/${imageBack.name}`
        );
      }

      if (audioFront) {
        updatedAudioUrlFront = await uploadFile(
          audioFront,
          `audio/${auth.uid}/AudioFront/${audioFront.name}`
        );
      }

      if (audioBack) {
        updatedAudioUrlBack = await uploadFile(
          audioBack,
          `audio/${auth.uid}/AudioBack/${audioBack.name}`
        );
      }

      const cardRef = doc(
        db,
        "Deck",
        auth.uid,
        "title",
        deckId,
        "cards",
        cardId
      );

      const updateData = {
        questionFront,
        questionBack,
        imageUrlFront: updatedImageUrlFront,
        imageUrlBack: updatedImageUrlBack,
        audioUrlFront: updatedAudioUrlFront,
        audioUrlBack: updatedAudioUrlBack,
        layoutFront, // บันทึก layoutFront
        layoutBack, // บันทึก layoutBack
      };

      // อัปเดตเอกสารใน Firestore
      await updateDoc(cardRef, updateData);
      router.push(`/cards/${deckId}`);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตการ์ด:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!auth) {
    return <p>กรุณาลงชื่อเข้าใช้เพื่อแก้ไขการ์ด.</p>;
  }

  if (!cardData) {
    return <p>กำลังโหลด...</p>;
  }

  return (
    <>
      <div className="p-2 grid grid-cols-3">
        <div></div>
        <div>
        <h1 className="col-start-5 col-end-8 flex justify-center font-mono text-3xl font-bold text-center text-gray-700 mt-1">
          {title}
        </h1>
        </div>
       <div className="flex justify-end">
       <div
          className="col-start-12 border-2 rounded-lg w-10 h-10 bg-red-600 text-white flex justify-center items-center cursor-pointer active:bg-red-700 active:scale-95 transition-transform duration-150 mt-1"
          onClick={() => router.push(`/cards/${deckId}`)}>
          <FontAwesomeIcon className="text-white text-md" icon={faTimes} />
        </div>
       </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-flow-col justify-stretch">
          <LayoutCardEdit
            title="แก้ไขการ์ด"
            deckId={deckId}
            setQuestionFront={setQuestionFront}
            questionFront={questionFront}
            setImageFront={setImageFront}
            imageFront={imageFront}
            setAudioFront={setAudioFront}
            audioFront={audioFront}
            setQuestionBack={setQuestionBack}
            questionBack={questionBack}
            setImageBack={setImageBack}
            imageBack={imageBack}
            setAudioBack={setAudioBack}
            audioBack={audioBack}
            imageUrlFront={imageUrlFront}
            imageUrlBack={imageUrlBack}
            audioUrlFront={audioUrlFront}
            audioUrlBack={audioUrlBack}
            setImageUrlFront={setImageUrlFront}
            setImageUrlBack={setImageUrlBack}
            setAudioUrlFront={setAudioUrlFront}
            setAudioUrlBack={setAudioUrlBack}
            setLayoutBack={setLayoutBack}
            layoutBack={layoutBack}
            setLayoutFront={setLayoutFront}
            layoutFront={layoutFront}
            loading={loading}
            saveEditedCard={handleSave}
            numberCard={numberCard}
            cardId={cardId}
            setLoading={setLoading}
          />
        </div>
      </form>
    </>
  );
};

export default EditCard;
