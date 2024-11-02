// app/dashboard/components/DeckList.js
"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../lip/firebase/clientApp";
import { doc, setDoc,getDocs, deleteDoc,getDoc } from "firebase/firestore";
import { collection, onSnapshot } from "firebase/firestore";
import useAuth from "../../lip/hooks/useAuth";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Link,
  Snippet,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShare,
  faGamepad,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import DeckDelete from "./DeckDelete";

const DeckListComponent = () => {
  const [decks, setDecks] = useState([]);
  const auth = useAuth();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [codeToCopy, setCodeToCopy] = useState(""); // ใช้ useState เพื่อเก็บโค้ด

  useEffect(() => {
    if (!auth) return;

    const deckRef = collection(db, "Deck", auth.uid, "title");
    const unsubscribe = onSnapshot(deckRef, (snapshot) => {
      if (!snapshot.empty) {
        const deckData = snapshot.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        setDecks(deckData);
      } else {
        setDecks([]);
      }
    });

    return () => unsubscribe();
  }, [auth]);


  const handleShareClick = async (friendId, deckId) => {
    try {
      // 1. ดึง deck ที่มีอยู่และการ์ดของมัน
      const deckRef = doc(db, "Deck", auth.uid, "title", deckId);
      const deckSnapshot = await getDoc(deckRef);
  
      if (!deckSnapshot.exists()) {
        throw new Error("Deck นี้ไม่มีอยู่!");
      }
  
      const deckData = deckSnapshot.data();
  
      // ดึงข้อมูลชื่อเพื่อนที่แชร์
      const friendRef = doc(db, "users", friendId);
      const friendSnapshot = await getDoc(friendRef);
  
      if (!friendSnapshot.exists()) {
        throw new Error("No name");
      }
  
      const friendData = friendSnapshot.data();
      const friendName = friendData.name; // เก็บชื่อเพื่อน
  
      // ดึงการ์ดทั้งหมดของ deck นั้น
      const cardsCollectionRef = collection(db, "Deck", auth.uid, "title", deckId, "cards");
      const cardsSnapshot = await getDocs(cardsCollectionRef);
  
      const cards = cardsSnapshot.docs.map((cardDoc) => ({
        ...cardDoc.data(),
        id: cardDoc.id,
      }));
  
      // 2. ลบ deck ที่แชร์ไปแล้วที่มี friendId และ deckId เดียวกัน
      const sharedDecksRef = collection(db, "sharedDecks");
      const querySnapshot = await getDocs(sharedDecksRef);
      let docIdToDelete = null;
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.friendId === friendId && data.deckId === deckId) {
          docIdToDelete = doc.id;
        }
      });
  
      if (docIdToDelete) {
        await deleteDoc(doc(db, "sharedDecks", docIdToDelete));
      }
  
      // 3. สร้าง shortCode ใหม่และแชร์ทั้ง deck แชร์การ์ด
      const shortCode = deckId;
  
      // บันทึกข้อมูล deck ที่แชร์ รวมถึงการ์ดและชื่อเพื่อน
      await setDoc(doc(db, "sharedDecks", shortCode), {
        friendId,
        deckId,
        friendName, // เพิ่มชื่อเพื่อนที่แชร์
        deckData,
        cards, // รวมการ์ดทั้งหมดในข้อมูลที่แชร์
      });
  
      // 4. แสดง shortCode ให้คัดลอก
      setCodeToCopy(shortCode);
      setIsPopupVisible(!isPopupVisible);
  
    } catch (error) {
      console.error("Error sharing deck:", error);
    }
  };

  const handleCloseClick = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {decks.map((deck) => (
        <div key={deck.id} className="w-full">
          <Card
            shadow
            hoverable
            className="m-2 shadow-md h-full flex flex-col justify-between"
          >
            <CardHeader className="pt-4 px-4 flex justify-between items-center">
              <Link href={`cards/${deck.id}`} underline="none">
                <h2 className="text-lg text-neutral-700 uppercase font-semibold hover:text-amber-500">
                  {deck.title}
                </h2>
              </Link>
              <div className="cursor-pointer  ml-2 mr-3 space-x-3">
                <Link
                  href={`PlayHistory/${deck.id}?Title=${deck.title}`}
                  //History
                  underline="none"
                >
                  <FontAwesomeIcon
                    icon={faClipboard}
                    size="xl"
                    style={{ color: "#FFD43B", padding: 3 }}
                  />
                </Link>

                <Link
                  href={`/Play/${deck.id}?Title=${deck.title}`}
                  underline="none"
                >
                  <FontAwesomeIcon
                    style={{ fontSize: "30px", color: "#dc2626" }}
                    icon={faGamepad}
                  ></FontAwesomeIcon>
                </Link>
              </div>
            </CardHeader>
            <CardBody className="pb-0 pt-2 px-4 overflow-visible py-2">
              <small className="text-default-500">{deck.description}</small>
            </CardBody>
            <CardFooter className="text-small flex justify-between items-center">
              <div className="ml-auto flex">
                <DeckDelete deck={deck} />
                <div className="cursor-pointer ml-2">
                  <FontAwesomeIcon
                    style={{ fontSize: "20px" }}
                    icon={faShare} // แชร์การ์ด
                    onClick={() => handleShareClick(auth.uid, deck.id)} // ส่ง deckId
                  />
                </div>
                {isPopupVisible && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white shadow-lg p-6 rounded relative">
                      <button
                        className="absolute top-2 right-2 border-2 rounded-md px-2 bg-red-600 text-white hover:bg-red-500"
                        onClick={handleCloseClick}
                      >
                        &times;
                      </button>
                      <p className="mt-4 mb-2">คัดลอกโค้ดนี้:</p>
                      <div className="flex items-center">
                        <Snippet symbol="">{codeToCopy}</Snippet>{" "}
                        {/* โค้ดที่จะแชร์ */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default DeckListComponent;