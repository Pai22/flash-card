// app/cards/components/DeleteCard.js
import React from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { db } from '../../lip/firebase/clientApp';
import useAuth from '../../lip/hooks/useAuth';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const DeleteCard = ({ deckId, cardId, imageFront, imageBack, audioFront, audioBack,layoutFront,layoutBack }) => {
  const auth = useAuth();
  const storage = getStorage();
  const [isNavigating, setIsNavigating] = useState(false); // เพิ่ม state สำหรับการโหลดหน้า dashboard
  const router = useRouter();

  const handleNavigate = () => {
    setIsNavigating(true); // ตั้งสถานะการโหลดเมื่อเริ่มเปลี่ยนเส้นทาง
    router.push(`/EditCard/${cardId}?deckId=${deckId}`); // เปลี่ยนเส้นทางไปยังหน้า dashboard
  };

  const handleDelete = async () => {
    if (!auth) return;

    const cardRef = doc(db, 'Deck', auth.uid, 'title', deckId, 'cards', cardId);

    try {
      // Delete the document
      await deleteDoc(cardRef);

      // Delete images and audio from Firebase Storage
      if (imageFront) {
        const imageFrontRef = ref(storage, imageFront);
        await deleteObject(imageFrontRef);
      }

      if (imageBack) {
        const imageBackRef = ref(storage, imageBack);
        await deleteObject(imageBackRef);
      }

      if (audioFront) {
        const audioFrontRef = ref(storage, audioFront);
        await deleteObject(audioFrontRef);
      }

      if (audioBack) {
        const audioBackRef = ref(storage, audioBack);
        await deleteObject(audioBackRef);
      }

      console.log('Card and associated files deleted successfully');
    } catch (error) {
      console.error('Error deleting card and files:', error);
    }
  };

  return (
<Dropdown>
      <DropdownTrigger>
        <div className="mt-2 cursor-pointer">
          <FontAwesomeIcon style={{ fontSize: "20px" }} icon={faEllipsis}></FontAwesomeIcon>
        </div>
      </DropdownTrigger>
      <DropdownMenu  className="" color="danger" variant="flat">
        <DropdownItem size="sm" onClick={handleDelete}>
          <FontAwesomeIcon style={{ fontSize: "20px" }} icon={faTrashAlt}></FontAwesomeIcon> Remove 
        </DropdownItem>
        <DropdownItem size="sm" onClick={handleNavigate}>
           EditCard
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default DeleteCard;
