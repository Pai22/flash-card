import { Button } from "@nextui-org/react";
import Link from "next/link";
import "./globals.css";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Welcome to my Flash Card</h1>
      <Link href="/dashboard">
        <Button color="primary">Get Started</Button>
      </Link>
   
    </>
  );
}
