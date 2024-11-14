// app/dashboard/components/DeckList.js
"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../lip/firebase/clientApp";
import { doc, setDoc,getDocs, deleteDoc,getDoc, query, orderBy  } from "firebase/firestore";
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
    const deckQuery = query(deckRef, orderBy("timestamp", "asc")); // เรียงจากใหม่ไปเก่า and asc จากเก่าไปใหม่
    const unsubscribe = onSnapshot(deckQuery, (snapshot) => {
      if (!snapshot.empty) {
        const deckData = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
          // .sort((a, b) => a.timestamp - b.timestamp);
        setDecks(deckData);
      } else {
        setDecks([]);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleShareClick = async (friendId, deckId) => {
    try {
      // 1. ตั้งค่า onSnapshot เพื่อฟังการเปลี่ยนแปลงของ deck
      const deckRef = doc(db, "Deck", auth.uid, "title", deckId);
      const unsubscribeDeck = onSnapshot(deckRef, (deckSnapshot) => {
        if (!deckSnapshot.exists()) {
          console.error("Deck นี้ไม่มีอยู่!");
          return;
        }
  
        const deckData = deckSnapshot.data();
        const { title, description } = deckData;
  
        // 2. ตั้งค่า onSnapshot เพื่อฟังการเปลี่ยนแปลงของการ์ด
        const cardsCollectionRef = collection(db, "Deck", auth.uid, "title", deckId, "cards");
        const unsubscribeCards = onSnapshot(cardsCollectionRef, (cardsSnapshot) => {
          const totalCard = cardsSnapshot.size;
          // const cards = cardsSnapshot.docs.map((cardDoc) => ({
          //   ...cardDoc.data(),
          //   id: cardDoc.id,
          // }));
  
          // 3. ดึงข้อมูลชื่อเพื่อน
          const friendRef = doc(db, "users", friendId);
          getDoc(friendRef).then(friendSnapshot => {
            if (!friendSnapshot.exists()) {
              throw new Error("No name");
            }
            
            const friendData = friendSnapshot.data();
            const friendName = friendData.name;
  
            // 4. แสดงข้อมูลที่ดึงมา
            console.log({
              title,
              description,
              friendName,
              // cards,
              totalCard
            });
  
            // 5. บันทึกข้อมูล deck ที่แชร์ รวมถึงการ์ดและชื่อเพื่อน
            setDoc(doc(db, "sharedDecks", deckId), {
              friendId,
              deckId,
              friendName, 
              description,
              title,
              // deckData,
              // cards, 
              totalCard
            });
  
            // แสดง shortCode ให้คัดลอก
            setCodeToCopy(deckId);
            setIsPopupVisible(!isPopupVisible);
          });
        });
      });
  
      // 6. คืนค่า unsubscribe เพื่อหยุดฟังเมื่อจำเป็น
      return () => {
        unsubscribeDeck();
        unsubscribeCards();
      };
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
                        className="absolute top-2 right-2 border-2 rounded-md px-3 py-1 bg-red-600 text-white hover:bg-red-500"
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
