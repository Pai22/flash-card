import React from 'react';
import { Input } from '@nextui-org/react';

const AddCardFront = ({ setQuestionFront, setImageFront, setAudioFront, questionFront, imageFront, audioFront }) => {
  const handleImageFrontChange = (e) => {
    const file = e.target.files[0];
    setImageFront(file);
  };

  const handleAudioFrontChange = (e) => {
    const file = e.target.files[0];
    setAudioFront(file);
  };

  return (
    <div className="mb-4 p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-2">ด้านหน้า</h3>
      <Input
        autoFocus
        label="คำถาม (ด้านหน้า)"
        name="questionFront"
        value={questionFront}
        onChange={(e) => setQuestionFront(e.target.value)}
        placeholder="กรอกคำถามสำหรับด้านหน้า"
        variant="bordered"
        fullWidth
      />
      <Input
        type="file"
        label="อัปโหลดรูปภาพ (ด้านหน้า)"
        accept="image/*"
        onChange={handleImageFrontChange}
        variant="bordered"
        fullWidth
        className="mt-4"
      />
      {imageFront && (
        <div className="mt-2">
          <img src={URL.createObjectURL(imageFront)} alt="Image Front" className="max-h-40" />
        </div>
      )}
      <Input
        type="file"
        label="อัปโหลดไฟล์เสียง (ด้านหน้า)"
        accept="audio/*"
        onChange={handleAudioFrontChange}
        variant="bordered"
        fullWidth
        className="mt-4"
      />
      {audioFront && (
        <div className="mt-2">
          <audio controls>
            <source src={URL.createObjectURL(audioFront)} type="audio/mpeg" />
          </audio>
        </div>
      )}
    </div>
  );
};

export default AddCardFront;
