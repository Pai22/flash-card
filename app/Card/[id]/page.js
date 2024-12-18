// app/Card/[id]/page.js
"use client";
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { storage } from "../../lip/firebase/clientApp";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../lip/firebase/clientApp";
import { Button } from "@nextui-org/react";
import useAuth from "../../lip/hooks/useAuth";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import "tailwindcss/tailwind.css"; // นำเข้า Tailwind CSS
import LayoutCard from "../components/LayoutCard";
import { toast, ToastContainer } from "react-toastify"; // นำเข้า react-toastify
import "react-toastify/dist/ReactToastify.css"; // นำเข้า styles ของ react-toastify
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const CardPage = () => {
  const auth = useAuth();
  const { id: deckId } = useParams();
  const [questionFront, setQuestionFront] = useState("");
  const [imageFront, setImageFront] = useState(null);
  const [audioFront, setAudioFront] = useState(null);
  const [questionBack, setQuestionBack] = useState("");
  const [imageBack, setImageBack] = useState(null);
  const [audioBack, setAudioBack] = useState(null);
  const [layoutFront, setLayoutFront] = useState("");
  const [layoutBack, setLayoutBack] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckTitle = searchParams.get("deckTitle");
  const initialCardsLength = parseInt(searchParams.get("cardsLength"), 10);
  const [cardsLength, setCardsLength] = useState(initialCardsLength);
  let [imageUrlFront, setImageUrlFront] = useState(null);
  let [imageUrlBack, setImageUrlBack] = useState(null);
  let [audioUrlFront, setAudioUrlFront] = useState(null);
  let [audioUrlBack, setAudioUrlBack] = useState(null);

  const handleFileUpload = async (file, path) => {
    const timestamp = new Date().getTime();
    const storageRef = ref(storage, `${path}_${timestamp}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleUploadFiles = async () => {
    if (imageFront) {
      imageUrlFront = await handleFileUpload(
        imageFront,
        `images/${auth.uid}/ImageFront/${imageFront.name}`
      );
    }

    if (audioFront) {
      audioUrlFront = await handleFileUpload(
        audioFront,
        `audio/${auth.uid}/AudioFront/${audioFront.name}`
      );
    }

    if (imageBack) {
      imageUrlBack = await handleFileUpload(
        imageBack,
        `images/${auth.uid}/ImageBack/${imageBack.name}`
      );
    }

    if (audioBack) {
      audioUrlBack = await handleFileUpload(
        audioBack,
        `audio/${auth.uid}/AudioBack/${audioBack.name}`
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
        layoutFront: layoutFront,
        layoutBack: layoutBack,
        timestamp: new Date().getTime(),
      });

      // เพิ่มจำนวนการ์ดในท้องถิ่น
      setCardsLength((prev) => prev + 1);

      router.push(`/cards/${deckId}`);
      // แสดงการแจ้งเตือนเมื่อเพิ่มการ์ดสำเร็จ
      toast.success("Successfully save a card!", { autoClose: 1500 });

      // รีเซ็ตฟอร์ม
      setQuestionFront("");
      setImageFront(null);
      setAudioFront(null);
      setQuestionBack("");
      setImageBack(null);
      setAudioBack(null);
      setLayoutFront("");
      setLayoutBack("");
    } catch (error) {
      console.error("Error adding card:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer /> {/* คอนเทนเนอร์สำหรับแสดงการแจ้งเตือน */}
      {/* <div className="container mx-auto mt-8 p-6 bg-white shadow-md rounded-lg"> */}
      <div className=" p-2 grid grid-cols-12">
        <p className="col-start-1 flex justify-center items-center col-end-3 font-mono text-md py-2 font-semibold text-gray-700">
          Total Cards {"  "}&nbsp;
          <span className="border-2 bg-white text-gray-700 rounded-md px-3 py-1">
            {cardsLength}
          </span>
        </p>
        <h1 className="col-start-5 col-end-8 flex justify-center font-mono text-3xl font-bold text-center text-gray-700 mt-1">
          {deckTitle}
        </h1>
        <div
          className="col-start-12 border-2 rounded-lg w-10 h-10 bg-red-600 text-white flex justify-center items-center cursor-pointer active:bg-red-700 active:scale-95 transition-transform duration-150 mt-1"
          onClick={() => router.push(`/cards/${deckId}`)}
        >
          <FontAwesomeIcon className="text-white text-md" icon={faTimes} />
        </div>
        
      </div>
      <form onSubmit={addCardToDeck} className="space-y-4">
        <div className="grid grid-flow-col justify-stretch">
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
            addCardToDeck={addCardToDeck}
          />
          {/* 
            <div className="flex justify-end space-x-4">
              <Button color="primary" type="submit" disabled={loading}>
                {loading ? "กำลังเพิ่ม..." : "เพิ่มการ์ด"}
              </Button>
            </div> */}
        </div>
      </form>
      {/* </div> */}
    </>
  );
};

export default CardPage;
