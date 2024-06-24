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
        <Link href="/dashboard">
          <img src="/assets/FlashcardLogo.png" alt="Google" className="w-20" />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
          <img src="/assets/FC.png" alt="Google" className="w-60" />
          </Link>
        </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Button as={Link}  href="#" variant="solid">
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
