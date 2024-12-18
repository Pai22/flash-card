import React from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db } from "../../lip/firebase/clientApp";
import useAuth from "../../lip/hooks/useAuth";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faPenToSquare,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

const DeleteCard = ({
  deckId,
  cardId,
  imageFront,
  imageBack,
  audioFront,
  audioBack,
  layoutFront,
  layoutBack,
  numberCard,
  deckTitle,
  
}) => {
  const auth = useAuth();
  const storage = getStorage();
  const [isNavigating, setIsNavigating] = useState(false); // เพิ่ม state สำหรับการโหลดหน้า dashboard
  const router = useRouter();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleNavigate = () => {
    setIsNavigating(true); // ตั้งสถานะการโหลดเมื่อเริ่มเปลี่ยนเส้นทาง
    router.push(`/EditCard/${cardId}?deckId=${deckId}&numberCard=${numberCard}&title=${deckTitle}`); // เปลี่ยนเส้นทางไปยังหน้า EditCard
  };

  const handleClick = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleDelete = async () => {
    if (!auth) return;
    // setLoading(true);

    // const confirm = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบการ์ด?");

    // if(!confirm){
    //   setLoading(false);
    //   return;
    // }

    const cardRef = doc(db, "Deck", auth.uid, "title", deckId, "cards", cardId);

    try {
      // ลบเอกสารใน Firestore
      await deleteDoc(cardRef);

      // ลบภาพและเสียงจาก Firebase Storage
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
      console.log('Deleted card ')
      
     
    } catch (error) {
      console.error("Error deleting card and files:", error);
    }
  };

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <div className="mt-2 cursor-pointer">
            <FontAwesomeIcon
              style={{ fontSize: "20px" }}
              icon={faEllipsis}
            ></FontAwesomeIcon>
          </div>
        </DropdownTrigger>
        <DropdownMenu className="" variant="flat">
          <DropdownItem size="sm" color="warning" onClick={handleNavigate}>
            <FontAwesomeIcon
              style={{ fontSize: "20px" }}
              icon={faPenToSquare}
            ></FontAwesomeIcon>
            EditCard
          </DropdownItem>
          <DropdownItem size="sm" color="danger" onClick={handleClick}> 
            <FontAwesomeIcon
              style={{ fontSize: "20px" }}
              icon={faTrashAlt}
            ></FontAwesomeIcon>{" "}
            Remove
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white shadow-lg p-10 rounded relative">
            <p className="ext-lg font-semibold text-gray-700">
            Are you sure you want to delete the card?
            </p>
            <div className="absolute bottom-2 right-2 flex space-x-2 ">
              <button
                className="px-3 py-1 text-xs font-medium rounded border border-blue-500 bg-blue-500 text-white hover:bg-blue-400"
                onClick={handleDelete}
              >
                OK
              </button>
              <button
                className="px-3 py-1 text-xs font-medium rounded border border-red-500 bg-red-500 text-white hover:bg-red-400"
                onClick={() => setIsPopupVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteCard;
