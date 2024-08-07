import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../lip/firebase/clientApp";
import { Card, CardBody, Link } from "@nextui-org/react";
import LoadingCard from "@/app/components/Loading/LoadingCard";
import useAuth from "../../lip/hooks/useAuth";
import DeleteCard from "./DeleteCard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRepeat, faCirclePlus } from '@fortawesome/free-solid-svg-icons';

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
            flipped: JSON.parse(localStorage.getItem(`card-${doc.id}-flipped`)) || false, // อ่านสถานะจาก localStorage
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

  const handleFlip = (id) => {
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.id === id) {
          const newFlipped = !card.flipped;
          localStorage.setItem(`card-${id}-flipped`, JSON.stringify(newFlipped)); // บันทึกสถานะลง localStorage
          return { ...card, flipped: newFlipped };
        }
        return card;
      })
    );
  };

  if (loading) {
    return <LoadingCard />;
  }

  return (
    <div className="flex flex-wrap mt-10 rounded-lg">
      <Link href={'/Card/'+ deckId}>
        <div className="flex-shrink-0 w-56 h-72 mx-10 mb-16 mt-9">
          <Card shadow hoverable className="bg-gray-100 rounded-3xl h-full">
            <CardBody className="flex-grow flex items-center justify-center text-2xl font-bold bg-gray-200 hover:bg-gradient-to-r from-red-400 to-red-700 ">
              <FontAwesomeIcon className="p-2" style={{ fontSize: "48px" }} icon={faCirclePlus} />
              New Card
            </CardBody>
          </Card>
        </div>
      </Link>
      {cards.map((card) => (
        <div key={card.id} className="flex-shrink-0 w-56 h-72 mx-10 mb-16">
          <div className="flex justify-center p-2">
            <FontAwesomeIcon
              style={{ fontSize: "20px" }}
              icon={faRepeat}
              onClick={() => handleFlip(card.id)}
            />
          </div>
          <Card shadow hoverable className="bg-gray-100 rounded-lg h-full">
            {card.flipped ? (
              <>
                <CardBody className="bg-white text-center flex-grow flex items-center justify-center">
                  <div>
                    <h4 className="font-semibold text-center">{card.questionBack}</h4>
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
                <CardBody className="flex-grow flex items-center justify-center">
                  <div>
                    <h4 className="font-semibold text-center">{card.questionFront}</h4>
                    {card.imageUrlFront && (
                      <img
                        src={card.imageUrlFront}
                        alt="Front"
                        className="w-full h-20 object-cover"
                      />
                    )}
                    {card.audioUrlFront && (
                      <audio controls className="w-5 absolute bottom-0 right-0">
                        <source src={card.audioUrlFront} type="audio/mpeg" />
                      </audio>
                    )}
                  </div>
                </CardBody>
              </>
            ) : (
              <>
                <CardBody className="flex-grow flex items-center justify-center">
                  <div>
                    <h4 className="font-semibold text-center">{card.questionFront}</h4>
                    {card.imageUrlFront && (
                      <img
                        src={card.imageUrlFront}
                        alt="Front"
                        className="w-full h-20 object-cover"
                      />
                    )}
                    {card.audioUrlFront && (
                      <audio controls className="w-5 absolute bottom-0 right-0">
                        <source src={card.audioUrlFront} type="audio/mpeg" />
                      </audio>
                    )}
                  </div>
                </CardBody>
                <CardBody className="bg-white text-center flex-grow flex items-center justify-center">
                  <div>
                    <h4 className="font-semibold text-center">{card.questionBack}</h4>
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
              </>
            )}
          </Card>
          <div className="flex justify-end">
            <DeleteCard
              deckId={deckId}
              cardId={card.id}
              imageFront={card.imageUrlFront}
              imageBack={card.imageUrlBack}
              audioFront={card.audioUrlFront}
              audioBack={card.audioUrlBack}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardList;
