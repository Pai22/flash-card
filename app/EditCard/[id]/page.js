// app/EditCard/[id]/page.js
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import useAuth from "@/app/lip/hooks/useAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lip/firebase/clientApp";
import { Input, Button } from "@nextui-org/react";
import LayoutCardEdit from "../components/EditLayoutCard";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"; // สำหรับจัดการไฟล์ใน Firebase Storage
import { storage } from "../../lip/firebase/clientApp"; // Import Firebase storage

const EditCard = () => {
  const { id: cardId } = useParams();
  const auth = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const deckId = searchParams.get("deckId");
  const numberCard = searchParams.get("numberCard");
  
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

  useEffect(() => {
    const fetchCardData = async () => {
      if (!auth) return;

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
          setImageUrlFront(data.imageFrontURL || "");
          setImageUrlBack(data.imageBackURL || "");
          setAudioUrlFront(data.audioFrontURL || "");
          setAudioUrlBack(data.audioBackURL || "");
          setLayoutFront(data.layoutFront || "");
          setLayoutBack(data.layoutBack || "");
        } else {
          console.log("ไม่พบเอกสาร!");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการ์ด:", error);
      }
    };

    fetchCardData();
  }, [auth, deckId, cardId]);

  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);

    try {
      // ตรวจสอบว่ามีการอัปโหลดไฟล์ใหม่ไหม
      let updatedImageUrlFront = imageUrlFront;
      let updatedImageUrlBack = imageUrlBack;
      let updatedAudioUrlFront = audioUrlFront;
      let updatedAudioUrlBack = audioUrlBack;

      if (imageFront) {
        updatedImageUrlFront = await uploadFile(
          imageFront,
          `Deck/${auth.uid}/${deckId}/${cardId}/imageFront`
        );
      }

      if (imageBack) {
        updatedImageUrlBack = await uploadFile(
          imageBack,
          `Deck/${auth.uid}/${deckId}/${cardId}/imageBack`
        );
      }

      if (audioFront) {
        updatedAudioUrlFront = await uploadFile(
          audioFront,
          `Deck/${auth.uid}/${deckId}/${cardId}/audioFront`
        );
      }

      if (audioBack) {
        updatedAudioUrlBack = await uploadFile(
          audioBack,
          `Deck/${auth.uid}/${deckId}/${cardId}/audioBack`
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
        imageFrontURL: updatedImageUrlFront,
        imageBackURL: updatedImageUrlBack,
        audioFrontURL: updatedAudioUrlFront,
        audioBackURL: updatedAudioUrlBack,
        layoutFront,
        layoutBack,
      };

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
      <div className="bg-blue-100 p-4 rounded-lg flex justify-between items-center">
        <Button color="warning" onClick={() => router.push(`/cards/${deckId}`)}>
          กลับไปยังเด็ค
        </Button>
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
            setLayoutFront={setLayoutFront}
            loading={loading}
            addCardToDeck={handleSave}
            numberCard={numberCard}
          />
        </div>
      </form>
    </>
  );
};

export default EditCard;
