// components/DeckWithCardsComponent.js
"use client"

import React, { useEffect, useState } from 'react';
import { db } from '../../lip/firebase/clientApp';
import { collection, onSnapshot } from 'firebase/firestore';
import useAuth from '../../lip/hooks/useAuth';
import { Card, CardHeader, CardBody, Button, CardFooter } from "@nextui-org/react";

const DeckWithCardsComponent = ({ deckId }) => {
  const [cards, setCards] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    if (!auth) return;

    const cardsRef = collection(db, 'Deck', auth.uid, 'title', deckId, 'cards');
    const unsubscribe = onSnapshot(cardsRef, (snapshot) => {
      if (!snapshot.empty) {
        const cardData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })).sort((a, b) => a.timestamp - b.timestamp);
        setCards(cardData);
      } else {
        setCards([]);
      }
    });

    return () => unsubscribe();
  }, [auth, deckId]);

  return (
    <div className='mt-12 flex flex-wrap justify-center'>
      {cards.map((card) => (
        <div key={card.id} className='w-72 max-w-xs mx-2 mb-4'>
          <Card shadow hoverable className="flex flex-col justify-between h-full">
            <CardHeader className='bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white '>
              <h2 className='text-lg font-bold'>{card.question}</h2>
            </CardHeader>
            <CardBody className="flex-grow">
              <p className="text-default-500">{card.answer}</p>
            </CardBody >
            <CardFooter className='flex justify-end'>
              <Button auto flat color="primary" className="mr-2">
                Edit
              </Button>
              <Button auto flat color="error">
                Delete
              </Button>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default DeckWithCardsComponent;
