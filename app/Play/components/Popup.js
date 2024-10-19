// app/Play/components/Popup.js
import React from "react";

const Popup = ({
  mode,
  setMode,
  startSide,
  setStartSide,
  cardCount,
  setCardCount,
  handleStart,
  cards,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-4">Option</h2>
        <div className="mb-4">
          <label className="block font-medium mb-2">Select Mode</label>
          <select
            className="w-full border border-gray-300 p-2 rounded-md"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="Single">Single mode</option>
            <option value="Multiple">Multiple mode</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">Start Side</label>
          <select
            className="w-full border border-gray-300 p-2 rounded-md"
            value={startSide}
            onChange={(e) => setStartSide(e.target.value)}
          >
            <option value="Front">Front</option>
            <option value="Back">Back</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">Question</label>
          <p>{`Total cards: ${cards.length}`}</p>
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">
            Number of Cards to Play
          </label>
          <input
            type="number"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={cardCount}
            onChange={(e) => {
              const value = e.target.value;
              // ตรวจสอบว่าเป็นค่าตัวเลขหรือเป็นค่าว่าง (เพื่ออนุญาตให้ลบได้)
              if (value === "" || !isNaN(Number(value))) {
                // แปลงค่าจาก input ให้เป็นตัวเลข และกำหนดขอบเขตเมื่อไม่ใช่ค่าว่าง
                const numericValue =
                  value === ""
                    ? ""
                    : Math.min(cards.length, Math.max(1, Number(value)));
                setCardCount(numericValue);
              }
            }}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleStart}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
