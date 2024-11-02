// app/dashboard/page.js
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDoc, doc, setDoc,getDocs } from "firebase/firestore";
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
  const [friendName, setFriendName] = useState("");
  const router = useRouter();
  const [code, setCode] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        try {
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            console.log("User data:", userSnap.data());
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

  const onClickButton = () => {
    // router.push("/dashboard/components/AddFriendDeck");
    setIsPopupVisible(!isPopupVisible);
  }

  // ส่วนอื่น ๆ ของโค้ดยังคงเดิม

  const handlerAddDeck = async () => {
    const shortCode = code; // รับรหัสที่เพื่อนแชร์มา
    try {
      // ดึงข้อมูลจาก Firestore โดยใช้รหัสสั้น
      const docRef = doc(db, "sharedDecks", shortCode);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const parsedData = docSnap.data();
        const deckData = parsedData.deckData; // ข้อมูล Deck ที่แชร์มา
        const cards = parsedData.cards; // การ์ดทั้งหมดที่แชร์มา
        const deckId = parsedData.deckId; // ใช้ deckId เดิม
        setFriendName(parsedData.friendName);
  
        // ตรวจสอบว่ามี deck.id อยู่ใน collection "Deck" ของผู้ใช้หรือไม่
        const existingDeckRef = doc(db, "Deck", user.uid, "title", deckId);
        const existingDeckSnap = await getDoc(existingDeckRef);
  
        if (existingDeckSnap.exists()) {
          alert("Deck นี้มีอยู่แล้วในบัญชีของคุณ!");
          return; // ถ้า deck มีอยู่แล้ว ให้หยุดการทำงาน
        }
  
        // เพิ่ม Deck ลงในบัญชีของผู้ใช้
        const userDeckRef = doc(db, "Deck", user.uid, "deckFriend", deckId);
        await setDoc(userDeckRef, { ...deckData, owner: parsedData.friendId });
  
        // เพิ่มการ์ดทั้งหมดลงใน Deck ของผู้ใช้
        for (const card of cards) {
          const userCardRef = doc(
            db,
            "Deck",
            user.uid,
            "deckFriend",
            deckId,
            "cards",
            card.id
          );
          await setDoc(userCardRef, card);
        }
  
        alert("เพิ่ม deck ของเพื่อนพร้อมการ์ดสำเร็จแล้ว!");
        setIsPopupVisible(false);
      } else {
        alert("ไม่พบรหัสที่ระบุ");
        return;
      }
    } catch (error) {
      console.error("Error adding friend's deck:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่ม deck");
      return;
    }
  };
  


  const handleCloseClick = () => {
    setIsPopupVisible(false);
  };
  
  return (
    <div className="p-10">
      <div className="flex justify-between">
        <div className="mb-10">
          <FontAwesomeIcon style={{ fontSize: "28px" }} icon={faLayerGroup} />
          <span className="ml-2 text-2xl font-semibold">Dashboard</span>
        </div>
      </div>
      {user ? (
        <div>
          <p>ยินดีต้อนรับ, {userName ? userName : "กำลังโหลด..."}</p>
        </div>
      ) : (
        <p>กรุณาเข้าสู่ระบบ.</p>
      )}
      <div className="flex items-center ml-2">
        <FontAwesomeIcon style={{ fontSize: "23px" }} icon={faCircleUser} />
        <span className="ml-2 text-md font-semibold">My Cards</span>
      </div>
      <AddToDeckComponent />
      <DeckListComponent />
      <div className="flex items-center ml-2 mt-10 mb-5">
        <FontAwesomeIcon style={{ fontSize: "23px" }} icon={faShareAlt} />
        <span className="ml-2 text-md font-semibold">Your Friend Deck</span>
      </div>
      <Button
        radius="full"
        onClick={onClickButton}
        className="font-semibold bg-lime-500 hover:bg-lime-500 focus:outline-none focus:ring focus:ring-lime-400 text-white text-[15px] shadow-lg ml-2"
      >
        <FontAwesomeIcon style={{ fontSize: "20px" }} icon={faPlus} />
        <span>Add Your Friend Deck</span>
      </Button>
      

      <AddFriendDeck
      friendName={friendName}
      />
      

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white shadow-lg p-6 rounded relative">
            <button
              className="absolute top-2 right-2 border-2 rounded-md px-2 bg-red-600 text-white hover:bg-red-500"
              onClick={handleCloseClick}
            >
              &times;
            </button>
            <p className="mt-4 mb-2">วางโค้ด:</p>
            <div className="flex items-center">
              <Input
                type="code"
                placeholder="Paste code"
                onClear={() => console.log("input cleared")}
                onChange={(e) => setCode(e.target.value)}
              />
              <Button
                color="primary"
                variant="light"
                radius="none"
                onClick={handlerAddDeck}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
