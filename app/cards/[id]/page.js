"use client"

import React, { useEffect, useState } from 'react';
import { db } from '../../lip/firebase/clientApp'; 
import { collection, onSnapshot, doc, addDoc } from 'firebase/firestore';
import useAuth from '../../lip/hooks/useAuth'; 
import { useParams } from 'next/navigation'; 
import { Card, CardHeader, CardBody, CardFooter, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // นำเข้าการใช้งาน useRouter จาก next/navigation
import LoadingComponent from '@/app/dashboard/components/Loading';

const DeckDetailComponent = () => {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const auth = useAuth();
  const { id: deckId } = useParams(); // ใช้ useParams เพื่อดึง deckId จาก URL
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
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

    const cardsRef = collection(db, "Deck", auth.uid, "title", deckId, "cards");
    const unsubscribeCards = onSnapshot(cardsRef, (snapshot) => {
      if (!snapshot.empty) {
        const cardData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCards(cardData);
      } else {
        setCards([]);
      }
    });

    return () => {
      unsubscribeDeck();
      unsubscribeCards();
    };
  }, [auth, deckId]);

  const addCardToDeck = async (e) => {
    e.preventDefault();
    if (!auth) return;

    const cardsRef = collection(db, 'Deck', auth.uid, 'title', deckId, 'cards');
    setLoading(true);
    try {
      const docRef = await addDoc(cardsRef, {
        question: question,
        answer: answer,
        timestamp: new Date().getTime(),
      });
      console.log('Card ID:', docRef.id);
      setQuestion('');
      setAnswer('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding card:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-1 '>
          <h2 className="text-lg font-bold">{deck.title}</h2>
          <h4>...CARDS</h4>
          <Button onPress={handleNavigate} color="warning">dashboard</Button> 
        </div>

        <h3 className="text-xl mb-4">Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Card key={card.id} shadow hoverable className="mb-4">
              <CardBody>
                <h4>Question: {card.question}</h4>
                <p>Answer: {card.answer}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <Button onPress={onOpen} color="default" variant="bordered" className="mt-4">
          Add New Card
        </Button>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
          <ModalContent>
            {(onClose) => (
              <>
                <form onSubmit={addCardToDeck}>
                  <ModalHeader className="flex flex-col gap-1">Add Card</ModalHeader>
                  <ModalBody>
                    <Input
                      autoFocus
                      label="Question"
                      name="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Enter your question"
                      variant="bordered"
                    />
                    <Input
                      label="Answer"
                      name="answer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Enter your answer"
                      variant="bordered"
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" type="submit" disabled={loading}>
                      {loading ? 'Adding...' : 'Add'}
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default DeckDetailComponent;
