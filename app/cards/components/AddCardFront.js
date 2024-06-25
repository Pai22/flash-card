import React, { useState } from 'react';
import { Input } from '@nextui-org/react';

const AddCardFront = ({ setQuestionFront, setImageFront, setAudioFront, questionFront, imageFront, audioFront }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold">Front Side</h3>
      <Input
        autoFocus
        label="Question (Front)"
        name="questionFront"
        value={questionFront}
        onChange={(e) => setQuestionFront(e.target.value)}
        placeholder="Enter your question for the front"
        variant="bordered"
      />
      <Input
        type="file"
        label="Upload Image (Front)"
        accept="image/*"
        onChange={(e) => setImageFront(e.target.files[0])}
        variant="bordered"
      />
      <Input
        type="file"
        label="Upload Audio (Front)"
        accept="audio/*"
        onChange={(e) => setAudioFront(e.target.files[0])}
        variant="bordered"
      />
    </div>
  );
};

export default AddCardFront;
