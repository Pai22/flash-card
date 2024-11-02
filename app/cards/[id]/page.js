"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../lip/firebase/clientApp";
import { onSnapshot, doc, collection } from "firebase/firestore";
import useAuth from "../../lip/hooks/useAuth";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import LoadingComponent from "../../components/Loading/LoadingRout";
import CardList from "../components/CardList";

const DeckDetailComponent = () => {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const auth = useAuth();
  const { id: deckId } = useParams(); // ใช้ useParams เพื่อดึง deckId จาก URL
  const searchParams = useSearchParams();
  const friendCards = searchParams.get("friendCards");
  const [friendId, setFriendId] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!auth || !deckId) return;

    if (friendCards == null) {
      const deckRef = doc(db, "Deck", auth.uid, "title", deckId);
      const unsubscribeDeck = onSnapshot(deckRef, (snapshot) => {
        if (snapshot.exists()) {
          setDeck({ ...snapshot.data(), id: snapshot.id });
        } else {
          setDeck(null);
        }
      });

      const cardsRef = collection(db, "Deck", auth.uid, "title", deckId, "cards");
      const unsubscribeCards = onSnapshot(cardsRef, (snapshot) => {
        const cardList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCards(cardList);
      });

      return () => {
        unsubscribeDeck();
        unsubscribeCards();
      };
    } else {
      const deckRef = doc(db, "Deck", auth.uid, "deckFriend", deckId);
      const unsubscribeDeck = onSnapshot(deckRef, (snapshot) => {
        if (snapshot.exists()) {
          const deckData = snapshot.data();
          setDeck({ ...deckData, id: snapshot.id });
          setFriendId(deckData.friendId); // ตั้งค่า friendId จากข้อมูล Deck
        } else {
          setDeck(null);
        }
      });
      return () => unsubscribeDeck(); // ทำการ unsubscribe เฉพาะ deck ก่อน
    }
  }, [auth, deckId, friendCards]);
  console.log("Fid"+friendId);

  useEffect(() => {
    if (!friendId || !deckId) return;

    const deckRef = doc(db, "Deck", friendId, "title", deckId);
      const unsubscribeDeck = onSnapshot(deckRef, (snapshot) => {
        if (snapshot.exists()) {
          setDeck({ ...snapshot.data(), id: snapshot.id });
        } else {
          setDeck(null);
        }
      });

      const cardsRef = collection(db, "Deck", friendId, "title", deckId, "cards");
      const unsubscribeCards = onSnapshot(cardsRef, (snapshot) => {
        const cardList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCards(cardList);
      });

      return () => {
        unsubscribeDeck();
        unsubscribeCards();
      };
  }, [friendId, deckId]);

  const handleNavigate = () => {
    setIsNavigating(true); // ตั้งสถานะการโหลดเมื่อเริ่มเปลี่ยนเส้นทาง
    router.push("/dashboard"); // เปลี่ยนเส้นทางไปยังหน้า dashboard
  };

  if (isNavigating || !deck) {
    // แสดง LoadingComponent เมื่อกำลังโหลดหรือไม่มีข้อมูล deck
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingComponent />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4">
          <h2 className="text-lg font-bold col-span-2">
            {deck.title} {friendCards != null ? "(share)" : ""}
          </h2>
          <Button
            color="warning"
            onClick={handleNavigate}
            className="col-start-10"
          >
            Dashboard
          </Button>
        </div>
        <h3 className="text-xl mb-4">Cards ({cards.length})</h3>
        <CardList
          deckId={deckId}
          deckTitle={deck.title}
          cardsLength={cards.length}
          friendCards={friendCards}
          friendId={friendId} 
        />
      </div>
    </>
  );
};

export default DeckDetailComponent;
