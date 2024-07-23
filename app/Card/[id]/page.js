"use client";
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../lip/firebase/clientApp";
import { Button } from "@nextui-org/react";
import useAuth from "../../lip/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import AddCardFront from "../components/AddCardFront";
import AddCardBack from "../components/AddCardBack";
import "tailwindcss/tailwind.css"; // นำเข้า Tailwind CSS
import LayoutCard from "../components/LayoutCard";

const CardPage = () => {
  const auth = useAuth();
  const { id: deckId } = useParams();
  const [questionFront, setQuestionFront] = useState("");
  const [imageFront, setImageFront] = useState(null);
  const [audioFront, setAudioFront] = useState(null);
  const [questionBack, setQuestionBack] = useState("");
  const [imageBack, setImageBack] = useState(null);
  const [audioBack, setAudioBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const storage = getStorage();

  const handleFileUpload = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleUploadFiles = async () => {
    let imageUrlFront = "";
    let audioUrlFront = "";
    let imageUrlBack = "";
    let audioUrlBack = "";

    if (imageFront) {
      imageUrlFront = await handleFileUpload(
        imageFront,
        `images/${auth.uid}/${deckId}/ImageFront/${imageFront.name}`
      );
    }

    if (audioFront) {
      audioUrlFront = await handleFileUpload(
        audioFront,
        `audio/${auth.uid}/${deckId}/AudioFront/${audioFront.name}`
      );
    }

    if (imageBack) {
      imageUrlBack = await handleFileUpload(
        imageBack,
        `images/${auth.uid}/${deckId}/ImageBack/${imageBack.name}`
      );
    }

    if (audioBack) {
      audioUrlBack = await handleFileUpload(
        audioBack,
        `audio/${auth.uid}/${deckId}/AudioBack/${audioBack.name}`
      );
    }

    return { imageUrlFront, audioUrlFront, imageUrlBack, audioUrlBack };
  };

  const addCardToDeck = async (e) => {
    e.preventDefault();
    if (!auth) return;

    setLoading(true);

    try {
      const { imageUrlFront, audioUrlFront, imageUrlBack, audioUrlBack } =
        await handleUploadFiles();

      const cardsRef = collection(
        db,
        "Deck",
        auth.uid,
        "title",
        deckId,
        "cards"
      );
      await addDoc(cardsRef, {
        questionFront: questionFront,
        imageUrlFront: imageUrlFront,
        audioUrlFront: audioUrlFront,
        questionBack: questionBack,
        imageUrlBack: imageUrlBack,
        audioUrlBack: audioUrlBack,
        timestamp: new Date().getTime(),
      });

      console.log("Card added successfully");
      setQuestionFront("");
      setImageFront(null);
      setAudioFront(null);
      setQuestionBack("");
      setImageBack(null);
      setAudioBack(null);
    } catch (error) {
      console.error("Error adding card:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-4">
          <Button
            color="warning"
            onClick={() => router.push(`/cards/${deckId}`)}
          >
            Back to deck
          </Button>
        </div>
      </div>
      <form onSubmit={addCardToDeck} className="space-y-6">
        <LayoutCard
          title="เพิ่มการ์ดใหม่"
          deckId={deckId}
          setQuestionFront={setQuestionFront}
          setImageFront={setImageFront}
          setAudioFront={setAudioFront}
          questionFront={questionFront}
          imageFront={imageFront}
          audioFront={audioFront}
          setQuestionBack={setQuestionBack}
          setImageBack={setImageBack}
          setAudioBack={setAudioBack}
          questionBack={questionBack}
          imageBack={imageBack}
          audioBack={audioBack}
        />

        <div className="flex justify-end space-x-4">
          <Button
            color="error"
            type="button"
            onClick={() => router.push(`/cards/${deckId}`)}
          >
            ยกเลิก
          </Button>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? "กำลังเพิ่ม..." : "เพิ่มการ์ด"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default CardPage;
