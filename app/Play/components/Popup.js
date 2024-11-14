// app/Play/components/Popup.js
import React ,{useState,useEffect}from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
// Import useRouter from next/router
import { useRouter } from "next/navigation";
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
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Ensure the code only runs on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Define the handleNavigate function
  const handleNavigate = () => {
    if (isClient) {
      router.push('/dashboard');  // Navigate to the dashboard page
    }
  };

  if (!isClient) {
    return null;  // Return null if rendered on the server side
  }


  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white p-4 rounded-md shadow-md w-96">
        <div className="grid grid-flow-row flex justify-between">
          <div></div>
          <div
            className="col-start-12 border-2 rounded-lg w-6 h-6 bg-red-600 text-white flex justify-center items-center cursor-pointer active:bg-red-700 active:scale-95 transition-transform duration-150 "
            onClick={handleNavigate}
          >
            <FontAwesomeIcon className="text-white text-md" icon={faTimes} />
          </div>
          <h2 className="text-lg font-bold mb-4">Option Play</h2>
        </div>
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
        <div className="flex justify-center">
          <button
            className="bg-pink-500 font-mono text-white font-semibold  px-5 py-2 rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:bg-pink-400 hover:scale-105 active:scale-95 focus:outline-none focus:ring-3 focus:ring-pink-500"
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
