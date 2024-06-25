"use client";
import React from "react";

import useAuth from "../lip/hooks/useAuth";
import AddToDeckComponent from "./components/AddDeck";
import DeckListComponent from "./components/DeckList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faCircleUser,
  faShare,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const user = useAuth();

  return (
    <div className=" p-10 ">
      <div className="flex items-center mb-10">
        <FontAwesomeIcon style={{ fontSize: "28px" }} icon={faLayerGroup} />
        <span className="ml-2 text-2xl font-semibold">Dashboard</span>
      </div>

      <div className="flex items-center ml-2">
        <FontAwesomeIcon style={{ fontSize: "23px" }} icon={faCircleUser}>
          My Cards
        </FontAwesomeIcon>
        <span className="ml-2  text-md font-semibold">My Cards</span>
      </div>
      <AddToDeckComponent />
      <DeckListComponent />
      <div className="flex items-center ml-2 m-10">
        <FontAwesomeIcon
          style={{ fontSize: "23px" }}
          icon={faShareAlt}
        ></FontAwesomeIcon>
        <span className="ml-2  text-md font-semibold">Your Friend Deck</span>
      </div>
    </div>
  );
}
