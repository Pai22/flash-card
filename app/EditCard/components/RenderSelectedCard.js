// app/EditCard/components/RenderSelectedCard.js
import styles from "../../Card/CreateCard.module.css";
import { Input } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAudio } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { getStorage, ref, deleteObject } from "firebase/storage"; // Import Firebase Storage functions
import { doc, updateDoc } from "firebase/firestore"; // Import Firestore functions
import { firestore } from "../../lip/firebase/clientApp"; 

export default function RenderSelectedCardEdit({
  selectedContent,
  side,
  questionFront,
  questionBack,
  setQuestionFront,
  setQuestionBack,
  imageUrlFront,
  imageUrlBack,
  handleFileChange,
  setImageFront,
  setImageBack,
  handleAudioChange,
  setAudioFront,
  setAudioBack,
  audioUrlFront,
  audioUrlBack,
  layoutFront,
  layoutBack,
  setLayoutBack,
  setLayoutFront,
  cardId, // เพิ่ม cardId เพื่ออ้างอิงไปยังเอกสารใน Firestore
}) {
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  // ฟังก์ชันสำหรับลบรูปภาพ
  const handleDeleteImage = async () => {
    try {
      // ลบไฟล์จาก Firebase Storage
      await deleteObject(storageRef);

      // อัปเดต state เพื่อไม่ให้แสดงภาพหลังจากลบ
      if (side === "front") {
        setImageFront(null);
      } else {
        setImageBack(null);
      }
    } catch (error) {
      console.error("Error removing image: ", error);
    }
  };

  return (
    <div className={`${styles[`flip-card-${side}`]} flex flex-col`}>
      {selectedContent ? (
        selectedContent.type === "TextImage" ||
        selectedContent.type === "ImageText" ? (
          <>
            {/* Top Content */}
            <div className="p-10 flex items-center justify-center overflow-hidden">
              {selectedContent.top === null ? (
                <Input
                  autoFocus
                  label={`ข้อความ (ด้าน${side === "front" ? "หน้า" : "หลัง"})`}
                  name={`question${
                    side.charAt(0).toUpperCase() + side.slice(1)
                  }`}
                  value={side === "front" ? questionFront : questionBack}
                  onChange={(e) =>
                    side === "front"
                      ? setQuestionFront(e.target.value)
                      : setQuestionBack(e.target.value)
                  }
                  placeholder={`กรอกข้อความสำหรับด้าน${
                    side === "front" ? "หน้า" : "หลัง"
                  }`}
                  variant="bordered"
                  fullWidth
                />
              ) : (
                selectedContent.top
              )}
            </div>
            {/* Divider */}
            <div className="border-t border-gray-300 mt-20"></div>
            {/* Bottom Content */}
            <div className="p-10 flex flex-col items-center justify-center overflow-hidden">
              {selectedContent.bottom === null ? (
                <Input
                  autoFocus
                  label={`ข้อความ (ด้าน${side === "front" ? "หน้า" : "หลัง"})`}
                  name={`question${
                    side.charAt(0).toUpperCase() + side.slice(1)
                  }`}
                  value={side === "front" ? questionFront : questionBack}
                  onChange={(e) =>
                    side === "front"
                      ? setQuestionFront(e.target.value)
                      : setQuestionBack(e.target.value)
                  }
                  placeholder={`กรอกข้อความสำหรับด้าน${
                    side === "front" ? "หน้า" : "หลัง"
                  }`}
                  variant="bordered"
                  fullWidth
                />
              ) : (
                selectedContent.bottom
              )}
            </div>
          </>
        ) : selectedContent.type === "text" ? (
          <div className="p-10 flex justify-center overflow-hidden">
            <Input
              autoFocus
              label={`ข้อความ (ด้าน${side === "front" ? "หน้า" : "หลัง"})`}
              name={`question${side.charAt(0).toUpperCase() + side.slice(1)}`}
              value={side === "front" ? questionFront : questionBack}
              onChange={(e) =>
                side === "front"
                  ? setQuestionFront(e.target.value)
                  : setQuestionBack(e.target.value)
              }
              placeholder={`กรอกข้อความสำหรับด้าน${
                side === "front" ? "หน้า" : "หลัง"
              }`}
              variant="bordered"
              color="warning"
            />
          </div>
        ) : (
          <div className="flex justify-center overflow-hidden">
            <div className="border-2 rounded-xl pb-4 px-10 pt-4 mb-2">
              <input
                type="file"
                label={`อัปโหลดรูปภาพ (ด้าน${
                  side === "front" ? "หน้า" : "หลัง"
                })`}
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(
                    e,
                    side === "front" ? setImageFront : setImageBack
                  )
                }
                className=""
              />

              {(side === "front" ? imageUrlFront : imageUrlBack) && (
                <div className="mt-2">
                  {/* <button
                    className="absolute top-2 right-2 border-2 rounded-md px-2 bg-red-600 text-white hover:bg-red-500"
                    onClick={handleDeleteImage} // เรียกใช้ฟังก์ชันลบเมื่อคลิก
                  >
                    &times;
                  </button> */}
                  <img
                    src={side === "front" ? imageUrlFront : imageUrlBack}
                    alt={`Image ${
                      side.charAt(0).toUpperCase() + side.slice(1)
                    }`}
                    className="max-h-40 mt-2"
                  />
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        ""
      )}

      {/* Audio Upload Section */}
      <div className="justify-center">
        <FontAwesomeIcon
          style={{ fontSize: "20px"}}
          className="text-gray-600 text-3xl p-1 rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer mb-2"
          icon={faFileAudio}
          onClick={handleIconClick}
        />
        <p className="text-center text-gray-700 font-medium">เลือกไฟล์เสียง</p>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) =>
            handleAudioChange(
              e,
              side === "front" ? setAudioFront : setAudioBack
            )
          }
          style={{ display: "none" }}
          ref={fileInputRef}
        />
        {(side === "front" ? audioUrlFront : audioUrlBack) && (
          <div className="mt-2">
            <audio controls>
              <source
                src={side === "front" ? audioUrlFront : audioUrlBack}
                type="audio/mpeg"
              />
              Your browser does not support the audio tag.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}
