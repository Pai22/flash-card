// app/EditCard/components/RenderSelectedCard.js
import styles from "../../Card/CreateCard.module.css";
import { Input } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAudio } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import { storage } from "../../lip/firebase/clientApp";
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
  setAudioUrlBack,
  setAudioUrlFront,
  setImageUrlFront,
  setImageUrlBack,
  setLayoutFront,
  cardId, // เพิ่ม cardId เพื่ออ้างอิงไปยังเอกสารใน Firestore
}) {
  const fileInputRef = useRef(null);
  const fileInputRefB = useRef(null);

  const deleteFile = async (filePath, fileUrl) => {
    fileUrl("");
    if (!filePath) return; // หากไม่มี filePath ให้ return แทนที
    const fileRef = ref(storage, filePath);
    try {
      await deleteObject(fileRef);
      console.log(`ลบไฟล์สำเร็จ: ${filePath}`);
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        console.warn(`ไฟล์ไม่พบใน Storage: ${filePath}`);
      } else {
        console.error(`เกิดข้อผิดพลาดในการลบไฟล์: ${filePath}`, error);
      }
    }
  };

  const handleDelete = async (file, fileUrl) => {
    fileUrl("");
    if (file === audioUrlBack) {
      fileInputRefB.current.value = ""; // รีเซ็ตค่า Input File
    } else {
      fileInputRef.current.value = ""; // รีเซ็ตค่า Input File
    }
    if (!file) return;
    const fileRef = ref(storage, file);
    try {
      await deleteObject(fileRef);
      console.log(`ลบไฟล์สำเร็จ: ${file}`);
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        console.warn(`ไฟล์ไม่พบใน Storage: ${file}`);
      } else {
        console.error(`เกิดข้อผิดพลาดในการลบไฟล์: ${file}`, error);
      }
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
                <div className="flex justify-center overflow-hidden">
                  <div className="border-2  rounded-xl  px-10 pt-4 mb-2">
                    <input
                      type="file"
                      label={`อัปโหลดรูปภาพ (ด้าน${
                        side === "front" ? "หน้า" : "หลัง"
                      })`}
                      accept="image/*"
                      onChange={handleFileChange(
                        side === "front" ? "front" : "back"
                      )}
                      className=""
                    />

                    {(side === "front" ? imageUrlFront : imageUrlBack) && (
                      <div className="mt-2">
                        <button
                          className="absolute top-10 right-16 border-2 rounded-md px-2 bg-red-600 text-white hover:bg-red-500"
                          onClick={() =>
                            deleteFile(
                              side === "front" ? imageUrlFront : imageUrlBack,
                              side === "front"
                                ? setImageUrlFront
                                : setImageUrlBack
                            )
                          } // เรียกใช้ฟังก์ชันลบเมื่อคลิก
                        >
                          &times;
                        </button>
                        <img
                          src={side === "front" ? imageUrlFront : imageUrlBack}
                          alt={`Image ${side}`}
                          className="max-h-40 mt-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Divider */}
            <div className="border-t border-gray-300 mt-20"></div>
            <div className="p-5 flex flex-col items-center justify-center overflow-hidden">
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
                <div className="flex justify-center overflow-hidden">
                  <div className="border-2 rounded-xl pb-4 px-10  mb-2">
                    <input
                      type="file"
                      label={`อัปโหลดรูปภาพ (ด้าน${
                        side === "front" ? "หน้า" : "หลัง"
                      })`}
                      accept="image/*"
                      onChange={handleFileChange(
                        side === "front" ? "front" : "back"
                      )}
                      className=""
                    />

                    {(side === "front" ? imageUrlFront : imageUrlBack) && (
                      <div className="mt-2">
                        <button
                          className="absolute right-16 bottom-64 border-2 rounded-md px-2 bg-red-600 text-white hover:bg-red-500"
                          onClick={() =>
                            deleteFile(
                              side === "front" ? imageUrlFront : imageUrlBack,
                              side === "front"
                                ? setImageUrlFront
                                : setImageUrlBack
                            )
                          } // เรียกใช้ฟังก์ชันลบเมื่อคลิก
                        >
                          &times;
                        </button>
                        <img
                          src={side === "front" ? imageUrlFront : imageUrlBack}
                          alt={`Image ${side}`}
                          className="max-h-40 mt-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
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
                onChange={handleFileChange(side === "front" ? "front" : "back")}
                className=""
              />

              {(side === "front" ? imageUrlFront : imageUrlBack) && (
                <div className="mt-2">
                  <button
                    className="absolute top-28 right-20 border-2 rounded-md px-2 bg-red-600 text-white hover:bg-red-500"
                    onClick={() =>
                      deleteFile(
                        side === "front" ? imageUrlFront : imageUrlBack,
                        side === "front" ? setImageUrlFront : setImageUrlBack
                      )
                    } // เรียกใช้ฟังก์ชันลบเมื่อคลิก
                  >
                    &times;
                  </button>
                  <img
                    src={side === "front" ? imageUrlFront : imageUrlBack}
                    alt={`Image ${side}`}
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
      {side === "front" ? (
        <div className="justify-center">
          <FontAwesomeIcon
            style={{ fontSize: "20px" }}
            className="text-gray-600 text-3xl p-1 rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer mb-2"
            icon={faFileAudio}
            onClick={() => fileInputRef.current.click()}
          />
          <p className="text-center text-gray-700 font-medium">
            เลือกไฟล์เสียง
          </p>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioChange("front")}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          {audioUrlFront && (
            <div className="mt-2">
              <audio controls>
                <source src={audioUrlFront} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
              <button
                className="absolute border-2 bottom-20 right-36 rounded-md px-2 bg-red-600 text-white hover:bg-red-500"
                onClick={() =>
                  handleDelete(audioUrlFront, setAudioUrlFront, "front")
                }
              >
                &times;
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="justify-center">
          <FontAwesomeIcon
            style={{ fontSize: "20px" }}
            className="text-gray-600 text-3xl p-1 rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer mb-2"
            icon={faFileAudio}
            onClick={() => fileInputRefB.current.click()}
          />
          <p className="text-center text-gray-700 font-medium">
            เลือกไฟล์เสียง
          </p>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioChange("back")}
            style={{ display: "none" }}
            ref={fileInputRefB}
          />
          {audioUrlBack && (
            <div className="mt-2">
              <audio controls>
                <source src={audioUrlBack} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
              <button
                className="absolute bottom-20 right-36 border-2 rounded-md px-2 bg-red-600 text-white hover:bg-red-500"
                onClick={() =>
                  handleDelete(audioUrlBack, setAudioUrlBack, "back")
                }
              >
                &times;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
