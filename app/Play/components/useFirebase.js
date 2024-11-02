import { db } from "../../lip/firebase/clientApp";
import { onSnapshot, collection, doc } from "firebase/firestore";

export function fetchCards(
  deckId,
  friendCards,
  auth,
  setCards,
  setCardCount,
  setLoading,
  setFriendId,
  setDeck
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
    // ดึง friendId จาก deckFriend ของ auth.uid ก่อน
    const deckRef = doc(db, "Deck", auth.uid, "deckFriend", deckId);

    const unsubscribeDeck = onSnapshot(deckRef, (snapshot) => {
      if (snapshot.exists()) {
        const deckData = snapshot.data();
        setDeck({ ...deckData, id: snapshot.id });
        const friendId = deckData.friendId;
        setFriendId(friendId);

        // เมื่อมี friendId แล้ว ดึงการ์ดจาก friendId
        const friendCardsRef = collection(db, "Deck", friendId, "title", deckId, "cards");

        const unsubscribeFriendCards = onSnapshot(
          friendCardsRef,
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
            console.error("Error fetching friend's cards: ", error);
            setLoading(false);
          }
        );

        return () => unsubscribeFriendCards(); // ยกเลิกการสมัครรับข้อมูลการ์ดของเพื่อน
      } else {
        setDeck(null);
        setLoading(false);
      }
    });

    // คืนค่าฟังก์ชันเพื่อยกเลิกการสมัครรับข้อมูล deck ของ auth.uid
    return () => unsubscribeDeck();
  }
}
