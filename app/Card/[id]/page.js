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

const CardPage = () => {
  const auth = useAuth();
  const { id: deckId } = useParams(); // ใช้ useParams เพื่อดึง deckId จาก URL
  const [questionFront, setQuestionFront] = useState("");
  const [imageFront, setImageFront] = useState(null);
  const [audioFront, setAudioFront] = useState(null);
  const [questionBack, setQuestionBack] = useState("");
  const [imageBack, setImageBack] = useState(null);
  const [audioBack, setAudioBack] = useState(null);
  const router = useRouter();
  const storage = getStorage();

  const handleFileUpload = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const addCardToDeck = async (e) => {
    e.preventDefault();
    if (!auth) return;

    setLoading(true);

    try {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4">
          <Button
            color="warning"
            className="col-start-10"
            onClick={() => router.push(`/cards/${deckId}`)}
          >
            Back to Cards
          </Button>
        </div>
      </div>

      <AddCardFront
        setQuestionFront={setQuestionFront}
        setImageFront={setImageFront}
        setAudioFront={setAudioFront}
        questionFront={questionFront}
        imageFront={imageFront}
        audioFront={audioFront}
      />
      <AddCardBack
        setQuestionBack={setQuestionBack}
        setImageBack={setImageBack}
        setAudioBack={setAudioBack}
        questionBack={questionBack}
        imageBack={imageBack}
        audioBack={audioBack}
      />
    </>
  );
};

export default CardPage;
