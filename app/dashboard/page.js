"use client";
import React from "react";
import SignOut from "../components/signout/signout";
import useAuth from "../lip/hooks/useAuth";


export default function Dashboard() {
  const user = useAuth();
  
  return (
    <div className="flex flex-col pt-12 items-center ">
      <SignOut />
      home
      {user ? (
        <>
          <p>Hello, {user.displayName || user.email}</p>
        </>
      ) : (
        <p>Please sign in or sign up to continue.</p>
      )}
    </div>
  );
}
