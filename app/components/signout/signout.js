"use client";
import React from "react";
import { auth } from "../../lip/firebase/clientApp";
import { signOut } from "firebase/auth";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const SignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <div>
      <Button
        color="danger"
        type="button"
        variant="solid"
        onClick={handleSignOut}
        className=" text-sm py-2 px-4 "
      >
        Sign Out
      </Button>
    </div>
  );
};

export default SignOut;
