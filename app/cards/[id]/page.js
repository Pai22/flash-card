"use client"

import React, { useEffect, useState } from 'react';
import { db } from '../../lip/firebase/clientApp'; 
import { collection, onSnapshot, doc } from 'firebase/firestore';
import useAuth from '../../lip/hooks/useAuth'; 
import { useParams } from 'next/navigation'; 
import { Button} from '@nextui-org/react';
import { useRouter } from 'next/navigation'; // นำเข้าการใช้งาน useRouter จาก next/navigation
import LoadingComponent from '../../components/Loading/LoadingRout';
import AddNewCard from '../components/AddCard';
import CardList from '../components/CardList';

const DeckDetailComponent = () => {
  const [deck, setDeck] = useState(null);
  const auth = useAuth();
  const { id: deckId } = useParams(); // ใช้ useParams เพื่อดึง deckId จาก URL
  const [isNavigating, setIsNavigating] = useState(false); // เพิ่ม state สำหรับการโหลดหน้า dashboard
  const router = useRouter(); // ใช้ useRouter เพื่อเปลี่ยนเส้นทาง

  useEffect(() => {
    if (!auth || !deckId) return;

    const deckRef = doc(db, "Deck", auth.uid, "title", deckId);
    const unsubscribeDeck = onSnapshot(deckRef, (snapshot) => {
      if (snapshot.exists()) {
        setDeck({ ...snapshot.data(), id: snapshot.id });
      } else {
        setDeck(null);
      }
    });

    return () => unsubscribeDeck();
  }, [auth, deckId]);


  const handleNavigate = () => {
    setIsNavigating(true); // ตั้งสถานะการโหลดเมื่อเริ่มเปลี่ยนเส้นทาง
    router.push('/dashboard'); // เปลี่ยนเส้นทางไปยังหน้า dashboard
  };

  if (isNavigating || !deck) { // แสดง LoadingComponent เมื่อกำลังโหลดหรือไม่มีข้อมูล deck
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
          <h2 className="text-lg font-bold col-span-2">{deck.title}</h2>
          <Button color="warning" onClick={handleNavigate} className="col-start-10">Dashboard</Button>
        </div>

        <h3 className="text-xl mb-4">Cards</h3>
        <CardList deckId={deckId} />

        <AddNewCard deckId={deckId} />
      </div>
    </>
  );
};

export default DeckDetailComponent;
