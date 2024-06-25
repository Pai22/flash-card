import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../lip/firebase/clientApp";
import { Card, CardBody, Link } from "@nextui-org/react";
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
          .sort((a, b) => a.timestamp - b.timestamp); 
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
    <div className="flex flex-wrap mt-10 rounded-lg">
      <Link href={'/Card/'+ deckId}>
      <div className="flex-shrink-0 w-56 h-72 mx-10 mb-16 mt-6">
          <Card shadow hoverable className="bg-gray-100 rounded-lg h-full">
            <CardBody className="flex-grow flex items-center justify-center">
              Icon Add Card
            </CardBody>
          </Card>
      </div>
    </Link>
      {cards.map((card) => (
        <div key={card.id} className="flex-shrink-0 w-56 h-72 mx-10 mb-16 ">
          <div className="flex justify-center">
          <FontAwesomeIcon className="p-2" style={{ fontSize: "20px" }} icon={faRepeat} />
          </div>
          <Card shadow hoverable className="bg-gray-100 rounded-lg h-full">
            <CardBody className="flex-grow flex items-center justify-center">
              <div>
                <h4 className="font-semibold">(Front): {card.questionFront}</h4>
                {card.imageUrlFront && (
                  <img
                    src={card.imageUrlFront}
                    alt="Front"
                    className=" w-full h-20 object-cover" 
                  />
                )}
                {card.audioUrlFront && (
                  <audio controls className="w-5 absolute bottom-0 right-0">
                    <source src={card.audioUrlFront} type="audio/mpeg" />
                  </audio>
                )}
              </div>
            </CardBody>
            <CardBody className=" bg-white text-center flex-grow flex items-center justify-center">
              <div>
                <h4 className="font-semibold">(Back): {card.questionBack}</h4>
                {card.imageUrlBack && (
                  <img
                    src={card.imageUrlBack}
                    alt="Back"
                    className="w-full h-20 object-cover" 
                  />
                )}
                {card.audioUrlBack && (
                  <audio controls className="w-5 absolute bottom-0 right-0">
                    <source src={card.audioUrlBack} type="audio/mpeg" />
                  </audio>
                )}
              </div>
            </CardBody>
          </Card>
          <div className="flex justify-end">
            <DeleteCard deckId={deckId} cardId={card.id} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardList;
