import React from "react";
import { db } from "../../lip/firebase/clientApp";
import { doc, deleteDoc } from "firebase/firestore";
import { Button } from "@nextui-org/react";
import useAuth from "../../lip/hooks/useAuth";

const DeckDelete = ({ deck }) => {
  const auth = useAuth();

  const handleDelete = async () => {
    if (!auth) return;

    const deckDocRef = doc(db, "Deck", auth.uid, "title", deck.id);
    try {
      await deleteDoc(deckDocRef);
      console.log(`Deleted deck: ${deck.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button auto flat color="error" onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeckDelete;
