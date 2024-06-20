"use client";
import React from "react";
import SignOut from "../components/signout/signout";
import useAuth from "../lip/hooks/useAuth";
import AddToDeckComponent from "./components/AddDeck";
import DeckListComponent from "./components/DeckList";


export default function Dashboard() {
  const user = useAuth();
  
  return (
    <div className="flex flex-col pt-12 items-center ">
      <SignOut />
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
