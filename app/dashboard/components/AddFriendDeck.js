// app/dashboard/components/AddFriendDeck.js
"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../lip/firebase/clientApp";
import {
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
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
    const deckQuery = query(deckRef, orderBy("createdAt", "asc")); // desc เรียงจากใหม่ไปเก่า and asc จากเก่าไปใหม่
    const unsubscribe = onSnapshot(deckQuery, (snapshot) => {
      if (!snapshot.empty) {
        const deckData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
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
          <Card shadow hoverable className="m-2 shadow-md h-full ">
            <CardHeader className="pt-4 flex flex-row justify-between">
              <div className="flex overflow-auto">
                <Link
                  href={`cards/${deck.id}?friendCards=${friendCards}`}
                  underline="none"
                >
                  <div className="text-lg text-neutral-700 uppercase font-semibold hover:text-amber-500 ">
                    {deck.title}
                    <div className="text-gray-500 text-sm">
                      ({deck.friendName})
                    </div>
                  </div>
                </Link>
              </div>

              <div className="cursor-pointer ml-2 pr-3 grid grid-cols-2 ">
                <div>
                  <Link
                    href={`PlayHistory/${deck.id}?Title=${deck.title}&friendCards=${friendCards}`}
                    underline="none"
                    className=" mr-3"
                  >
                    <FontAwesomeIcon
                      icon={faClipboard}
                      size="xl"
                      style={{ color: "#FFD43B", padding: 3 }}
                    />
                  </Link>
                </div>

                <div>
                  {" "}
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
              </div>
            </CardHeader>
            <CardBody className="py-2 pt-2 px-4 overflow-auto">
              <small className="text-default-500 ">{deck.description}</small>
            </CardBody>
            <CardFooter className=" flex justify-between items-center">
              <div className="ml-auto flex">
                <DeckDelete deck={deck} friendCards={friendCards} />
              </div>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default AddFriendDeck;
