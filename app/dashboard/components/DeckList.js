"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../lip/firebase/clientApp";
import { collection, onSnapshot } from "firebase/firestore";
import useAuth from "../../lip/hooks/useAuth";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  CardFooter,
  Link,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShare,
  faPlay,
  faClipboard,
} from "@fortawesome/free-solid-svg-icons";
import DeckDelete from "./DeckDelete";

const DeckListComponent = () => {
  const [decks, setDecks] = useState([]);
  const auth = useAuth();

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

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const codeToCopy = "YOUR_CODE_HERE"; // โค้ดที่ต้องการคัดลอก

  const handleShareClick = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(codeToCopy)
      .then(() => {
        alert("คัดลอกโค้ดเรียบร้อยแล้ว!");
        setIsPopupVisible(false); // ปิด popup หลังจากคัดลอกสำเร็จ
      })
      .catch((err) => {
        console.error("ไม่สามารถคัดลอกโค้ดได้:", err);
      });
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
            <Link href={"/cards/" + deck.id} underline="none">
              <CardHeader className="pt-4 px-4 flex justify-between items-center">
                <h2 className="text-lg text-neutral-700 uppercase font-semibold hover:text-amber-500">
                  {deck.title}
                </h2>
                <div className="cursor-pointer  ml-2 mr-3">
                  <Link href={"/Play/" + deck.id} underline="none">
                    <FontAwesomeIcon
                      style={{ fontSize: "30px", color: "#be123c" }}
                      icon={faPlay}
                    ></FontAwesomeIcon>
                  </Link>
                </div>
              </CardHeader>
            </Link>
            <CardBody className="pb-0 pt-2 px-4 overflow-visible py-2">
              <small className="text-default-500">{deck.description}</small>
            </CardBody>
            <CardFooter className="text-small flex justify-between items-center">
              <div className="ml-auto flex">
                <DeckDelete deck={deck} />
                <div className="cursor-pointer ml-2">
                  <FontAwesomeIcon
                    style={{ fontSize: "20px" }}
                    icon={faShare}
                    onClick={handleShareClick}
                  />
                </div>
                {isPopupVisible && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white shadow-lg p-6 rounded">
                      <p className="mb-4">คัดลอกโค้ดนี้:</p>
                      <div className="flex items-center">
                        <span className="border p-2 rounded bg-gray-100">
                          {codeToCopy}
                        </span>
                        <Button
                          color="primary"
                          variant="light"
                          className="ml-2"
                          onClick={handleCopyClick}
                        >
                          <FontAwesomeIcon icon={faClipboard} />
                          <span className="ml-1">คัดลอก</span>
                        </Button>
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
