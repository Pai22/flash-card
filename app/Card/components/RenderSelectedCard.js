// app/Card/components/RenderSelectedCard.js
import styles from "../CreateCard.module.css";
import { Input } from "@nextui-org/react";

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
  return (
        <div
          className={`${
            styles[`flip-card-${side}`]
          } flex flex-col items-center justify-center`}
        >
          {selectedContent ? (
            selectedContent.type === "TextImage" ||
            selectedContent.type === "ImageText" ? (
              <>
                <div className="p-10 flex items-center justify-center overflow-hidden">
                  <div>
                    {selectedContent.top === null ? (
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
                        fullWidth
                      />
                    ) : (
                      selectedContent.top
                    )}
                  </div>
                </div>
                <div className="border-t border-gray-300 mb-4"></div>
                <div className="p-4 flex flex-col items-center justify-center overflow-hidden">
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
                        fullWidth
                      />
                    ) : (
                      selectedContent.bottom
                    )}
                  </div>
                </div>
              </>
            ) : selectedContent.type === "text" ? (
              <div className="p-20 flex items-center justify-center overflow-hidden">
                <Input
                  autoFocus
                  label={` (ด้าน${side === "front" ? "หน้า" : "หลัง"})`}
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
                  fullWidth
                />
              </div>
            ) : (
              <div className="p-20 flex items-center justify-center overflow-hidden">
                <div>
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
                    className="mt-4"
                  />
                  {(side === "front" ? imageUrlFront : imageUrlBack) && (
                    <div className="mt-2">
                      <img
                        src={side === "front" ? imageUrlFront : imageUrlBack}
                        alt={`Image ${
                          side.charAt(0).toUpperCase() + side.slice(1)
                        }`}
                        className="max-h-40"
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            <p className={`${styles.title}`}>{`${side.toUpperCase()} SIDE`}</p>
          )}
          <div className="flex items-end justify-end">
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioChange(
                side === "front" ? setAudioFront : setAudioBack
              )}
              variant="bordered"
              fullWidth
              className="mt-4"
            />
            {(side === "front" ? audioUrlFront : audioUrlBack) && (
              <div className="mt-2">
                <audio controls>
                  <source src={side === "front" ? audioUrlFront : audioUrlBack} type="audio/mpeg" />
                </audio>
              </div>
            )}
          </div>
        </div>
      
  );
}
