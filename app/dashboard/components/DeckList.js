"use client"

import React, { useEffect, useState } from 'react';
import { db } from '../../lip/firebase/clientApp';
import { collection, onSnapshot } from 'firebase/firestore';
import useAuth from '../../lip/hooks/useAuth';
import {Card, CardHeader, CardBody, Button, CardFooter, Link} from "@nextui-org/react";
import DeckDelete from './DeckDelete';



const DeckListComponent = () => {
  const [decks, setDecks] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    if (!auth) return;

    const deckRef = collection(db, "Deck", auth.uid, "title");
    const unsubscribe = onSnapshot(deckRef, (snapshot) => {
      if (!snapshot.empty) {
        const deckData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })).sort((a, b) => a.timestamp - b.timestamp);
        setDecks(deckData);
      } else {
        setDecks([]);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-wrap justify-start'>
        {decks.map((deck) => (
          <div key={deck.id} className='w-72 max-w-xs m-2'>
            <Card shadow hoverable className="flex flex-col justify-between h-full">
              <Link href={'/cards/'+ deck.id} underline="none">
                <CardHeader className='bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white'>
                  <h2 className='text-lg font-bold'>{deck.title}</h2>
                </CardHeader>
              </Link>
              <CardBody className="flex-grow">
                <small className="text-default-500">{deck.description}</small>
              </CardBody>
              <CardFooter className='flex justify-end'>
                <DeckDelete deck={deck}/>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default DeckListComponent;
