// app/components/Navbar.js
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import SignOut from "../components/signout/signout";

export default function App() {
  return (
    <Navbar isBordered>
      <NavbarBrand>
        <img
          src="/assets/Flashcard.png"
          alt="Google"
          className="w-20"
        />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="solid">
            Sign Up
          </Button>
        </NavbarItem>
        <NavbarItem>
          <SignOut />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
