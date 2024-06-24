import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../lip/firebase/clientApp";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import LoadingCard from "@/app/components/Loading/LoadingCard";
import useAuth from "../../lip/hooks/useAuth";
import DeleteCard from "./DeleteCard";

const CardList = ({ deckId }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    if (!auth || !deckId) return;

    const cardsRef = collection(db, "Deck", auth.uid, "title", deckId, "cards");
    const unsubscribeCards = onSnapshot(cardsRef, (snapshot) => {
      if (!snapshot.empty) {
        const cardData = snapshot.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
          .sort((a, b) => a.timestamp - b.timestamp); // เรียงลำดับตาม timestamp จากใหม่ไปเก่า
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
    <>
      {cards.map((card) => (
        <div>
          <Card key={card.id} shadow hoverable className="mb-4 bg-slate-200 rounded-lg">
            <CardBody>
              <h4>Question: {card.question}</h4>
              <p>Answer: {card.answer}</p>
            </CardBody>
            <CardFooter className="flex justify-end">
              <DeleteCard deckId={deckId} cardId={card.id} />
            </CardFooter>
          </Card>
        </div>
      ))}
    </>
  );
};

export default CardList;
