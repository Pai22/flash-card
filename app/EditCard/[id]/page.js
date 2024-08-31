// app/EditCard/[id]/page.js
"use client"

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import useAuth from "@/app/lip/hooks/useAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lip/firebase/clientApp";
import { Input } from "@nextui-org/react";

const EditCard = () => {
    const { id: cardId } = useParams();
    const auth = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const deckId = searchParams.get('deckId');
    const [cardData, setCardData] = useState(null);
    const [questionFront, setQuestionFront] = useState("");
    const [questionBack, setQuestionBack] = useState("");
    const [imageFrontURL, setImageFrontURL] = useState("");
    const [imageBackURL, setImageBackURL] = useState("");
    const [audioFrontURL, setAudioFrontURL] = useState("");
    const [audioBackURL, setAudioBackURL] = useState("");
    const [layoutFront, setLayoutFront] = useState("");
    const [layoutBack, setLayoutBack] = useState("");

    useEffect(() => {
        const fetchCardData = async () => {
            if (!auth) return;

            try {
                const cardRef = doc(db, "Deck", auth.uid, "title", deckId, "cards", cardId);
                const cardSnap = await getDoc(cardRef);

                if (cardSnap.exists()) {
                    const data = cardSnap.data();
                    setCardData(data);
                    setQuestionFront(data.questionFront || "");
                    setQuestionBack(data.questionBack || "");
                    setImageFrontURL(data.imageFrontURL || "");
                    setImageBackURL(data.imageBackURL || "");
                    setAudioFrontURL(data.audioFrontURL || "");
                    setAudioBackURL(data.audioBackURL || "");
                    setLayoutFront(data.layoutFront || "");
                    setLayoutBack(data.layoutBack || "");
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching card data:", error);
            }
        };

        fetchCardData();
    }, [auth, deckId, cardId]);

    const handleSave = async () => {
        if (!auth) return;

        try {
            const cardRef = doc(db, "Deck", auth.uid, "title", deckId, "cards", cardId);

            await updateDoc(cardRef, {
                questionFront,
                questionBack,
                imageFrontURL,
                imageBackURL,
                audioFrontURL,
                audioBackURL
            });

            router.push(`/cards/${deckId}`); // เปลี่ยนเส้นทางไปยังหน้า cards/deckId หลังจากบันทึกเสร็จ
        } catch (error) {
            console.error("Error updating card:", error);
        }
    };

    if (!auth) {
        return <p>Please log in to edit the card.</p>;
    }

    if (!cardData) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Edit Card</h2>
            <div>
        <div>Front:</div>
        {layoutFront === "text" ? (
          <img src="/assets/TextIcon.png" alt="TextIcon" className="w-20" />
        ) : layoutFront === "image" ? (
          <img src="/assets/ImageIcon.png" alt="ImageIcon" className="w-20" />
        ) : layoutFront === "TextImage" ? (
          <div>
            <img src="/assets/TextIcon.png" alt="TextIcon" className="w-20" />
            <img src="/assets/ImageIcon.png" alt="ImageIcon" className="w-20" />
          </div>
        ) : (
          <div>
            <img src="/assets/ImageIcon.png" alt="ImageIcon" className="w-20" />
            <img src="/assets/TextIcon.png" alt="TextIcon" className="w-20" />
          </div>
        )}
      </div>
      <div>
        <div>Back:</div>
        {layoutBack === "text" ? (
          <img src="/assets/TextIcon.png" alt="TextIcon" className="w-20" />
        ) : layoutBack === "image" ? (
          <img src="/assets/ImageIcon.png" alt="ImageIcon" className="w-20" />
        ) : layoutBack === "TextImage" ? (
          <div>
            <img src="/assets/TextIcon.png" alt="TextIcon" className="w-20" />
            <img src="/assets/ImageIcon.png" alt="ImageIcon" className="w-20" />
          </div>
        ) : (
          <div>
            <img src="/assets/ImageIcon.png" alt="ImageIcon" className="w-20" />
            <img src="/assets/TextIcon.png" alt="TextIcon" className="w-20" />
          </div>
        )}
      </div>
            <button onClick={handleSave}>Save</button>
        </div>
    );
}

export default EditCard;
