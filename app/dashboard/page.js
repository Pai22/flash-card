"use client";
import React from "react";

import useAuth from "../lip/hooks/useAuth";
import AddToDeckComponent from "./components/AddDeck";
import DeckListComponent from "./components/DeckList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faUser,
  faPlus,
  faShareNodes,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const user = useAuth();
  
  return (
   
    <div className=" bg-cray-400 p-10">
      <div className="flex items-center mb-6">
        <FontAwesomeIcon style={{ fontSize: "25px" }} icon={faLayerGroup} />
        <span className="ml-2 text-2xl font-bold">Dashboard</span>
      </div>
      <div className="flex items-center">
        <FontAwesomeIcon style={{ fontSize: "25px" }} icon={faUser} />
        <span className="ml-2 text-xl font-semibold">My Cards</span>
      </div>
      
      {user ? (
        <>
          <p>Hello, {user.displayName || user.email}</p>
        </>
      ) : (
        <p>Please sign in or sign up to continue.</p>
      )}
      
      <AddToDeckComponent />
      <DeckListComponent />
    </div>
    
    
  );
}
