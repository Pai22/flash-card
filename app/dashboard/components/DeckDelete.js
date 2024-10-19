// app/decks/components/DeckDelete.js
import React, { useState } from "react";
import { db, storage } from "../../lip/firebase/clientApp";
import { doc, deleteDoc, collection, getDocs, query } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import useAuth from "../../lip/hooks/useAuth";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const DeckDelete = ({ deck, friendCards }) => {
  const auth = useAuth();
  const [loading, setLoading] = useState();

  const handleDelete = async () => {
    if (!auth) return;
    setLoading(true);

    if (friendCards == null) {
      const confirmed = window.confirm(
        "คุณแน่ใจหรือไม่ว่าต้องการลบเด็คและการ์ดทั้งหมด?"
      );

      if (!confirmed) {
        setLoading(false);
        return;
      }

      const deckDocRef = doc(db, "Deck", auth.uid, "title", deck.id);
      const cardsRef = collection(
        db,
        "Deck",
        auth.uid,
        "title",
        deck.id,
        "cards"
      );
      const gameResultsRef = collection(
        db,
        "Deck",
        auth.uid,
        "title",
        deck.id,
        "gameResults"
      );

      try {
        const cardDocs = await getDocs(cardsRef);
        const deletePromises = [];

        cardDocs.forEach((cardDoc) => {
          const cardData = cardDoc.data();
          if (cardData.imageUrlFront) {
            const imageFrontRef = ref(storage, cardData.imageUrlFront);
            deletePromises.push(deleteObject(imageFrontRef));
          }
          if (cardData.imageUrlBack) {
            const imageBackRef = ref(storage, cardData.imageUrlBack);
            deletePromises.push(deleteObject(imageBackRef));
          }
          if (cardData.audioUrlFront) {
            const audioFrontRef = ref(storage, cardData.audioUrlFront);
            deletePromises.push(deleteObject(audioFrontRef));
          }
          if (cardData.audioUrlBack) {
            const audioBackRef = ref(storage, cardData.audioUrlBack);
            deletePromises.push(deleteObject(audioBackRef));
          }
          const cardDocRef = doc(cardsRef, cardDoc.id);
          deletePromises.push(deleteDoc(cardDocRef));
        });

        await Promise.all(deletePromises);
        const gameResultsDocs = await getDocs(gameResultsRef);
        gameResultsDocs.forEach((resultDoc) => {
          const resultDocRef = doc(gameResultsRef, resultDoc.id);
          deletePromises.push(deleteDoc(resultDocRef));
        });
        await deleteDoc(deckDocRef);
        console.log(`Deleted deck and all associated cards: ${deck.id}`);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      const confirmed = window.confirm(
        "คุณแน่ใจหรือไม่ว่าต้องการลบเด็คและการ์ดทั้งหมด?"
      );

      if (!confirmed) {
        setLoading(false);
        return;
      }

      const deckDocRef = doc(db, "Deck", auth.uid, "deckFriend", deck.id);
      const cardsRef = collection(
        db,
        "Deck",
        auth.uid,
        "deckFriend",
        deck.id,
        "cards"
      );

      const gameResultsRef = collection(
        db,
        "Deck",
        auth.uid,
        "deckFriend",
        deck.id,
        "gameResults"
      );

      try {
        const cardDocs = await getDocs(cardsRef);
        const deletePromises = [];

        cardDocs.forEach((cardDoc) => {
          const cardDocRef = doc(cardsRef, cardDoc.id);
          deletePromises.push(deleteDoc(cardDocRef));
        });

        await Promise.all(deletePromises);
        const gameResultsDocs = await getDocs(gameResultsRef);
        gameResultsDocs.forEach((resultDoc) => {
          const resultDocRef = doc(gameResultsRef, resultDoc.id);
          deletePromises.push(deleteDoc(resultDocRef));
        });
        await deleteDoc(deckDocRef);
        console.log(`Deleted deck and all associated cards: ${deck.id}`);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* <Dropdown>
        <DropdownTrigger>
          <div className="cursor-pointer">
            <FontAwesomeIcon
              style={{ fontSize: "20px" }}
              icon={faEllipsis}
            ></FontAwesomeIcon>
          </div>
        </DropdownTrigger> */}
      {/* <DropdownMenu color="danger" variant="flat">
          <DropdownItem size="sm" onClick={handleDelete} disabled={loading}> */}
      <div onClick={handleDelete} disabled={loading}>
        <FontAwesomeIcon
          style={{ fontSize: "20px" }}
          icon={faTrashAlt}
        ></FontAwesomeIcon>{" "}
      </div>
      {/* Remove
          </DropdownItem>
        </DropdownMenu>
      </Dropdown> */}
    </>
  );
};

export default DeckDelete;
