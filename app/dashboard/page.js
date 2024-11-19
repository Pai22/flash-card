// app/dashboard/page.js
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDoc, doc,setDoc,getDocs } from "firebase/firestore";
import { auth, db } from "../lip/firebase/clientApp";
import AddFriendDeck from "./components/AddFriendDeck";
import useAuth from "../lip/hooks/useAuth";
import AddToDeckComponent from "./components/AddDeck";
import DeckListComponent from "./components/DeckList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faCircleUser,
  faShareAlt,
  faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Input, Button } from "@nextui-org/react";


export default function Dashboard() {
  const user = useAuth();
  const [userName, setUserName] = useState("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const router = useRouter();
  const [code, setCode] = useState("");
  const [deckInfo, setDeckInfo] = useState(null); // Store deck information here
  const [isAddingDeck, setIsAddingDeck] = useState(false);
  const [friendId, setFriendId] = useState(null);
  const [cardId, setCardId] = useState(null); // Store friend's cards here

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserName(userSnap.data().name);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting document:", error);
        }
      }
    };
    fetchUserName();
  }, [user]);

  const handleClickButton = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const fetchSharedDeck = async () => {
    if (!code) return alert("กรุณาใส่โค้ดแชร์ก่อน");
  
    try {
      const docRef = doc(db, "sharedDecks", code);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const deckData = docSnap.data();
        setDeckInfo(deckData);  // ตั้งค่าข้อมูล deck เพื่อแสดงใน UI
        setFriendId(deckData.friendId);  // ตั้งค่า friendId เพื่อส่งไปยัง AddFriendDeck
        setCardId(deckData.deckId);
      } else {
        alert("Deck ไม่พบ");
      }
    } catch (error) {
      console.error("Error fetching shared deck:", error);
      alert("เกิดข้อผิดพลาดในการดึงข้อมูล Deck");
    }
  };
  

  const handleAddDeck = async () => {
    if (!deckInfo) {
      alert("ไม่พบข้อมูล Deck");
      return;
    } // ตรวจสอบว่า deckInfo มีค่า
    
    const { friendId, deckId, friendName, description, title } = deckInfo;
    
    // console.log("Adding deck:", { friendId, deckId, friendName, description, title });
    
    try {
      if (friendId === user?.uid) { // ตรวจสอบว่าชุดการ์ดเป็นของตัวเองหรือไม่
        alert("ไม่สามารถเพิ่มชุดการ์ดของตัวเองได้");
        setIsPopupVisible(false);
        return;
      }
      await setDoc(doc(db, "Deck", user.uid, "deckFriend", deckId), {
        friendId,
        deckId,
        friendName,
        description,
        title,
        createdAt: new Date().getTime(), // บันทึกเวลาที่สร้าง
      });
  
      setIsAddingDeck(true);
      setFriendId(friendId);
      setTimeout(() => {
        // alert("Deck ได้ถูกเพิ่มเรียบร้อยแล้ว!");
        setIsPopupVisible(false);
        setIsAddingDeck(false);
        setCode("");  // ทำให้ค่า code กลับเป็นค่าว่าง
        setDeckInfo(null);  // ลบข้อมูล deckInfo
      }, 1000); // Simulate adding delay
  
    } catch (error) {
      console.error("Error adding deck:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่ม Deck");
    }
  };
  
  const handleCancelAddDeck = () => {
    setIsPopupVisible(false);
    setDeckInfo(null);  // ลบข้อมูล deckInfo
    setCode("");  // ทำให้ค่า code กลับเป็นค่าว่าง
  };
  
  return (
    <div className="p-5">
        <div className="flex justify-between">
          <div className="mb-5">
            <FontAwesomeIcon style={{ fontSize: "28px" }} icon={faLayerGroup} />
            <span className="font-mono ml-2 text-2xl font-semibold">Dashboard</span>
          </div>
        </div>

        {user ? (
          <div >
            <p className="font-mono ">Welcome,  {userName ? userName : "กำลังโหลด..."} ! </p>
          </div>
        ) : (
          <p>กรุณาเข้าสู่ระบบ.</p>
        )}

        <div className="flex items-center ml-2 mt-5">
          <FontAwesomeIcon style={{ fontSize: "23px" }} icon={faCircleUser} />
          <span className="font-mono ml-2 text-md font-semibold">My Decks</span>
        </div>

        <AddToDeckComponent/>

        <DeckListComponent />

        <div className="flex items-center ml-2 mt-10 mb-5">
          <FontAwesomeIcon style={{ fontSize: "23px" }} icon={faShareAlt} />
          <span className="font-mono ml-2 text-md font-semibold">Your Friend Deck</span>
        </div>

        <Button
          radius="full"
          onClick={handleClickButton}
          className="font-semibold bg-lime-500 hover:bg-lime-500 focus:outline-none focus:ring focus:ring-lime-400 text-white text-[15px] shadow-lg ml-2 mb-5"
        >
          <FontAwesomeIcon style={{ fontSize: "15px" }} icon={faPlus} />
          <span className="font-mono ">Add Your Friend Deck</span>
        </Button>

        <AddFriendDeck />
        {isPopupVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white shadow-lg p-6 rounded relative">
              <button
                className="absolute top-2 right-2 border-2 rounded-md px-2  border-red-600 bg-red-600 text-white hover:bg-red-500"
                onClick={handleCancelAddDeck}
                // onClick={() => setIsPopupVisible(false)}
                >
                &times;
              </button>
              <p className="mt-2 mb-2 text-lg font-semibold text-gray-700">Paste code to search</p>
              <div className="flex items-center mb-4 ">
                <Input
                  className="mr-2"
                  placeholder="Paste code here"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button
                className="px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-500 disabled:bg-gray-400"
                  color="secondary"
                  onClick={fetchSharedDeck}
                  disabled={!code}
                >
                  Search
                </Button>
              </div>

              {deckInfo && (
                <div className="mt-4">
                  <h3 className="font-bold text-lg">{deckInfo.title}</h3>
                  <p>รายละเอียด: {deckInfo.description}</p>
                  <p>จำนวนการ์ด: {deckInfo.totalCard}</p>
                  <p>สร้างโดย: {deckInfo.friendName}</p>

                  <div className="mt-6">
                    <Button
                      color="success"
                      onClick={handleAddDeck}
                      disabled={isAddingDeck}
                    >
                      {isAddingDeck ? "Adding..." : "Add"}
                    </Button>
                    <Button
                      color="error"
                      onClick={handleCancelAddDeck}
                      className="ml-4"
                    >
                      ยกเลิก
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
