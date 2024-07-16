import React from 'react';
import { Input } from '@nextui-org/react';

const AddCardBack = ({ setQuestionBack, setImageBack, setAudioBack, questionBack, imageBack, audioBack }) => {
  const handleImageBackChange = (e) => {
    const file = e.target.files[0];
    setImageBack(file);
  };

  const handleAudioBackChange = (e) => {
    const file = e.target.files[0];
    setAudioBack(file);
  };

  return (
    <div className="mb-4 p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-2">ด้านหลัง</h3>
      <Input
        label="คำถาม (ด้านหลัง)"
        name="questionBack"
        value={questionBack}
        onChange={(e) => setQuestionBack(e.target.value)}
        placeholder="กรอกคำถามสำหรับด้านหลัง"
        variant="bordered"
        fullWidth
      />
      <Input
        type="file"
        label="อัปโหลดรูปภาพ (ด้านหลัง)"
        accept="image/*"
        onChange={handleImageBackChange}
        variant="bordered"
        fullWidth
        className="mt-4"
      />
      {imageBack && (
        <div className="mt-2">
          <img src={URL.createObjectURL(imageBack)} alt="Image Back" className="max-h-40" />
        </div>
      )}
      <Input
        type="file"
        label="อัปโหลดไฟล์เสียง (ด้านหลัง)"
        accept="audio/*"
        onChange={handleAudioBackChange}
        variant="bordered"
        fullWidth
        className="mt-4"
      />
      {audioBack && (
        <div className="mt-2">
          <audio controls>
            <source src={URL.createObjectURL(audioBack)} type="audio/mpeg" />
          </audio>
        </div>
      )}
    </div>
  );
};

export default AddCardBack;
