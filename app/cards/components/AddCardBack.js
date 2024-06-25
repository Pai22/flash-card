import React, { useState } from 'react';
import { Input } from '@nextui-org/react';

const AddCardBack = ({ setQuestionBack, setImageBack, setAudioBack, questionBack, imageBack, audioBack }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold">Back Side</h3>
      <Input
        label="Question (Back)"
        name="questionBack"
        value={questionBack}
        onChange={(e) => setQuestionBack(e.target.value)}
        placeholder="Enter your question for the back"
        variant="bordered"
      />
      <Input
        type="file"
        label="Upload Image (Back)"
        accept="image/*"
        onChange={(e) => setImageBack(e.target.files[0])}
        variant="bordered"
      />
      <Input
        type="file"
        label="Upload Audio (Back)"
        accept="audio/*"
        onChange={(e) => setAudioBack(e.target.files[0])}
        variant="bordered"
      />
    </div>
  );
};

export default AddCardBack;
