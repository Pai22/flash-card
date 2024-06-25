// app/components/Navbar.js
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import SignOut from "../components/signout/signout";
import useAuth from "../lip/hooks/useAuth";

export default function App() {
  const router = useRouter();
  const auth = useAuth();
  const [navButton, setNavButton] = useState(null);

  useEffect(() => {
    if (auth) {
      setNavButton(
        <NavbarItem>
          <SignOut />
        </NavbarItem>
      );
    } else {
      setNavButton(
        <>
          <NavbarItem>
            <Button
              as={Link}
              href="/dashboard"
              color="primary"
              className=" text-md font-bold text-white py-2 px-4 "
            >
              Log in
            </Button>
          </NavbarItem>
          <NavbarItem></NavbarItem>
        </>
      );
    }
  }, [auth, router.pathname]);

  return (
    <Navbar isBordered>
      <NavbarBrand>
        <img src="/assets/FlashCardlogo.png" alt="Logo" className="w-20" />
        <img src="/assets/FC.png" alt="Logo" className="w-60" />
      </NavbarBrand>
      <NavbarContent className="" justify="end">
        {navButton}
      </NavbarContent>
    </Navbar>
  );
}
