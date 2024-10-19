// app/dashboard/components/AddFriendDeck.js
"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../lip/firebase/clientApp";
import { doc, setDoc, getDocs, deleteDoc, getDoc } from "firebase/firestore";
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

const AddFriendDeck = () => {
  const [decks, setDecks] = useState([]);
  const auth = useAuth();
  const [friendCards, setFriendCards] = useState("t");

  useEffect(() => {
    if (!auth) return;

    const deckRef = collection(db, "Deck", auth.uid, "deckFriend");
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
              <Link
                href={`cards/${deck.id}?friendCards=${friendCards}`}
                underline="none"
              >
                <div>
                  <h2
                    className="text-lg text-neutral-700 uppercase font-semibold hover:text-amber-500"
                    style={{ display: "inline" }}
                  >
                    {deck.title}
                  </h2>
                  <h5
                    className="text-lg text-neutral-500 font-semibold"
                    style={{ display: "inline", marginLeft: "8px" }} // เว้นช่องระหว่าง title และ (share)
                  >
                    (share)
                  </h5>
                </div>
              </Link>

              <div className="cursor-pointer  ml-2 mr-3 space-x-3">
                <Link
                  href={`PlayHistory/${deck.id}?Title=${deck.title}&friendCards=${friendCards}`}
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
                  href={`/Play/${deck.id}?Title=${deck.title}&friendCards=${friendCards}`}
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
                <DeckDelete 
                deck={deck}
                friendCards={friendCards}
                />
              </div>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default AddFriendDeck;
