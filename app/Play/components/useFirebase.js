// app/Play/components/useFirebase.js
import { db } from "../../lip/firebase/clientApp";
import { onSnapshot, collection } from "firebase/firestore";

export function fetchCards(
  deckId,
  friendCards,
  auth,
  setCards,
  setCardCount,
  setLoading
) {
  if (!auth || !deckId) return;

  if (friendCards == null) {
    const cardsRef = collection(db, "Deck", auth.uid, "title", deckId, "cards");

    const unsubscribeCards = onSnapshot(
      cardsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cardData = snapshot.docs
            .map((doc) => ({
              ...doc.data(),
              id: doc.id,
              layoutFront: doc.data().layoutFront || null,
              layoutBack: doc.data().layoutBack || null,
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
          setCards(cardData);
          setCardCount(cardData.length);
        } else {
          setCards([]);
          setCardCount(0);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching cards: ", error);
        setLoading(false); // ปิดสถานะการโหลดแม้จะเกิดข้อผิดพลาด
      }
    );

    // คืนค่าฟังก์ชันเพื่อยกเลิกการสมัครรับข้อมูล
    return () => unsubscribeCards();
  } else {
    const cardsRef = collection(db, "Deck", auth.uid, "deckFriend", deckId, "cards");

    const unsubscribeCards = onSnapshot(
      cardsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cardData = snapshot.docs
            .map((doc) => ({
              ...doc.data(),
              id: doc.id,
              layoutFront: doc.data().layoutFront || null,
              layoutBack: doc.data().layoutBack || null,
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
          setCards(cardData);
          setCardCount(cardData.length);
        } else {
          setCards([]);
          setCardCount(0);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching cards: ", error);
        setLoading(false); // ปิดสถานะการโหลดแม้จะเกิดข้อผิดพลาด
      }
    );

    // คืนค่าฟังก์ชันเพื่อยกเลิกการสมัครรับข้อมูล
    return () => unsubscribeCards();
  }
}
