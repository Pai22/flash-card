import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../lip/firebase/clientApp';
import { Card, CardBody } from '@nextui-org/react';
import LoadingCard from '@/app/components/Loading/LoadingCard';
import useAuth from "../../lip/hooks/useAuth";

const CardList = ({ deckId }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth(); // เพิ่มการใช้งาน useAuth ที่ได้สร้างไว้

  useEffect(() => {
    if (!auth || !deckId) return;

    const cardsRef = collection(db, 'Deck', auth.uid, 'title', deckId, 'cards');
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
      setLoading(false);
    });

    return () => unsubscribeCards();
  }, [auth, deckId]);

  if (loading) {
    return <LoadingCard />;
  }

  return (
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
  );
};

export default CardList;
