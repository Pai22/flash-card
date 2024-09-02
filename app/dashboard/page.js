"use client";
import React, { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../lip/firebase/clientApp";
import useAuth from "../lip/hooks/useAuth";
import AddToDeckComponent from "./components/AddDeck";
import DeckListComponent from "./components/DeckList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faCircleUser,
  faShareAlt,
  faMagnifyingGlass,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { Input,Button } from "@nextui-org/react";

export default function Dashboard() {
  const user = useAuth();
  const [userName, setUserName] = useState("");

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
        className="font-semibold bg-lime-500 hover:bg-lime-500 focus:outline-none focus:ring focus:ring-lime-400 text-white text-[15px] shadow-lg ml-2">
         <FontAwesomeIcon
          style={{ fontSize: "20px"}}
          icon={faPlus}
        /><span>Add Your Friend Deck</span>
       
      </Button>
    </div>
  );
}
