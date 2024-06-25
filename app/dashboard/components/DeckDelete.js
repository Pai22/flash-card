import React from "react";
import { db } from "../../lip/firebase/clientApp";
import { doc, deleteDoc } from "firebase/firestore";
import { Button } from "@nextui-org/react";
import useAuth from "../../lip/hooks/useAuth";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

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
    <Dropdown >
    <DropdownTrigger>
    <div className="cursor-pointer">
        <FontAwesomeIcon
          style={{ fontSize: "20px" }}
          icon={faEllipsis}
        ></FontAwesomeIcon>
      </div>
    </DropdownTrigger>
    <DropdownMenu
      color="danger"
      variant="flat"
    >
      <DropdownItem size="sm" onClick={handleDelete}>
      <FontAwesomeIcon
          style={{ fontSize: "20px" }}
          icon={faTrashAlt}
        ></FontAwesomeIcon> Remove deck
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
  );
};

export default DeckDelete;
