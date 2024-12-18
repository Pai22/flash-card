import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../lip/firebase/clientApp";
import { Card, CardBody, Link } from "@nextui-org/react";
import LoadingCard from "@/app/components/Loading/LoadingCard";
import useAuth from "../../lip/hooks/useAuth";
import DeleteCard from "./DeleteCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { updateDoc, doc } from "firebase/firestore";
import layoutCard from '../../cards/components/layoutCard'
const CardList = ({ deckId, deckTitle, cardsLength, friendCards,friendId }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = useAuth();

  useEffect(() => {
    if (!auth || !deckId) return;

    if (friendCards == null) {
      const cardsRef = collection(
        db,
        "Deck",
        auth.uid,
        "title",
        deckId,
        "cards"
      );
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
    } else {
      const cardsRef = collection(
        db,
        "Deck",
        friendId,
        "title",
        deckId,
        "cards"
      );
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
    }
  }, [auth, deckId]);

  const handleFlip = async (id) => {
    const cardRef = doc(db, "Deck", auth.uid, "title", deckId, "cards", id);
    setCards((prevCards) =>
      prevCards.map((card) => {
        if (card.id === id) {
          // สลับข้อมูลใน Firestore
          updateDoc(cardRef, {
            questionFront: card.questionBack,
            questionBack: card.questionFront,
            imageUrlFront: card.imageUrlBack,
            imageUrlBack: card.imageUrlFront,
            audioUrlFront: card.audioUrlBack,
            audioUrlBack: card.audioUrlFront,
            layoutBack: card.layoutFront,
            layoutFront: card.layoutBack,
          });

          // สลับข้อมูลในแอป
          return {
            ...card,
            questionFront: card.questionBack,
            questionBack: card.questionFront,
            imageUrlFront: card.imageUrlBack,
            imageUrlBack: card.imageUrlFront,
            audioUrlFront: card.audioUrlBack,
            audioUrlBack: card.audioUrlFront,
            layoutBack: card.layoutFront,
            layoutFront: card.layoutBack,
          };
        }
        return card;
      })
    );
  };

  if (loading) {
    return <LoadingCard />;
  }

  return (
    <div className="flex flex-wrap rounded-lg my-5 ">
      {/* <Link href={"/Card/" + deckId}> */}
      {friendCards == null ? (
        <Link
          href={`/Card/${deckId}?deckTitle=${deckTitle}&cardsLength=${cardsLength}`}
        >
          <div className="flex-shrink-0 w-56 h-72 mx-10 mt-16">
            <Card shadow hoverable className="bg-gray-100 rounded-3xl h-full">
              <CardBody className="flex-grow flex items-center justify-center text-2xl font-bold bg-gray-200 hover:bg-gradient-to-r from-red-400 to-red-700 hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg rounded-lg cursor-pointer">
                <FontAwesomeIcon
                  className="p-2 text-white"
                  style={{ fontSize: "48px" }}
                  icon={faCirclePlus}
                />
                <span className="font-mono ml-2 text-white">New Card</span>
              </CardBody>
            </Card>
          </div>
        </Link>
      ) : (
        ""
      )}

      {cards.map((card, index) => (
        <div key={card.id} className="flex-shrink-0 w-56 h-72 mx-10 my-10">
          {friendCards == null ? (
            <div className="flex justify-center p-2">
            <FontAwesomeIcon
              className="text-black hover:text-green-500 active:text-green-400 cursor-pointer"
              style={{ fontSize: "20px" }}
              icon={faRepeat}
              onClick={() => handleFlip(card.id)}
            />
          </div>
          ): ""}
          <Card shadow hoverable className="bg-gray-100 rounded-lg h-full">
            <CardBody className=" h-64 flex items-center justify-center">
              {layoutCard(card,'front')}
            </CardBody>
            <CardBody className="bg-white text-center  h-64 flex items-center justify-center">
              {layoutCard(card,'back')}
            </CardBody>
          </Card>
          <div class="flex flex-row ">
            <div class=" flex justify-end basis-1/2 pt-2 font-mono text-lg font-semibold ">
             {index + 1}
            </div>
            {friendCards == null ? (
              <div class="flex justify-start basis-1/2 pl-2 ">
                <DeleteCard
                  deckId={deckId}
                  cardId={card.id}
                  imageFront={card.imageUrlFront}
                  imageBack={card.imageUrlBack}
                  audioFront={card.audioUrlFront}
                  audioBack={card.audioUrlBack}
                  layoutFront={card.layoutFront}
                  layoutBack={card.layoutBack}
                  numberCard={index + 1}
                  deckTitle={deckTitle}

                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardList;
