// app/Card/components/RenderSelectedCard.js
import styles from "../CreateCard.module.css";
import { Input, Textarea } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAudio } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";

export default function RenderSelectedCard({
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
}) {
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`${styles[`flip-card-${side}`]} flex flex-col`}>
      {selectedContent ? (
        selectedContent.type === "TextImage" ||
        selectedContent.type === "ImageText" ? (
          <>
            <div className="p-10 justify-center overflow-hidden">
              <div>
                {selectedContent.top === null ? (
                  <Input
                    autoFocus
                    label={`ข้อความ (ด้าน${
                      side === "front" ? "หน้า" : "หลัง"
                    })`}
                    color="primary"
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
            </div>
            <div className="border-t border-gray-300 mt-20"></div>
            <div className="p-10  overflow-hidden">
              <div>
                {selectedContent.bottom === null ? (
                  <Input
                    autoFocus
                    label={`ข้อความ (ด้าน${
                      side === "front" ? "หน้า" : "หลัง"
                    })`}
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
                    color="secondary"
                    fullWidth
                  />
                ) : (
                  selectedContent.bottom
                )}
              </div>
            </div>
          </>
        ) : selectedContent.type === "text" ? (
          <div className="p-10 flex justify-center overflow-hidden">
            <Input
              autoFocus
              label={` ข้อความ (ด้าน${side === "front" ? "หน้า" : "หลัง"})`}
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
                  onChange={handleFileChange(
                    side === "front" ? setImageFront : setImageBack
                  )}
                  variant="bordered"
                  fullWidth
                  className=""
                />
              {(side === "front" ? imageUrlFront : imageUrlBack) && (
                <div className="flex justify-center mt-2">
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
        <p className={`${styles.title}`}>{`${side.toUpperCase()} SIDE`}</p>
      )}

      {/* Audio Upload Section */}
      <div className="justify-center">
        <FontAwesomeIcon
          icon={faFileAudio}
          onClick={handleIconClick}
          className="text-gray-600 text-3xl p-1 rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out transform hover:scale-110 cursor-pointer mb-2"
          style={{ fontSize: "20px" }}
        />
        <p className="text-center text-gray-700 font-medium">เลือกไฟล์เสียง</p>
        <input
          type="file"
          accept="audio/*"
          onChange={handleAudioChange(
            side === "front" ? setAudioFront : setAudioBack
          )}
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
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}
