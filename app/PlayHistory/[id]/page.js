// app/PlayHistory/PlayHistory.js
"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../lip/firebase/clientApp";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import useAuth from "../../lip/hooks/useAuth";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

const PlayHistory = () => {
  const [gameResults, setGameResults] = useState([]);
  const user = useAuth();
  const { id: deckId } = useParams();
  const searchParams = useSearchParams();
  const Title = searchParams.get("Title");
  const friendCards = searchParams.get("friendCards");
  const router = useRouter();

  useEffect(() => {
    if (!user || !deckId) return;

    if (friendCards == null) {
      const fetchGameResults = async () => {
        try {
          const gameResultsRef = collection(
            db,
            "Deck",
            user.uid,
            "title",
            deckId,
            "gameResults"
          );
          const resultsQuery = query(
            gameResultsRef,
            orderBy("timestamp", "desc"),
            limit(5)
          );
          const querySnapshot = await getDocs(resultsQuery);
          const results = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGameResults(results);
        } catch (error) {
          console.error("Error fetching game results: ", error);
        }
      };

      fetchGameResults();
    } else {
      const fetchGameResults = async () => {
        try {
          const gameResultsRef = collection(
            db,
            "Deck",
            user.uid,
            "deckFriend",
            deckId,
            "gameResults"
          );
          const resultsQuery = query(
            gameResultsRef,
            orderBy("timestamp", "desc"),
            limit(5)
          );
          const querySnapshot = await getDocs(resultsQuery);
          const results = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGameResults(results);
        } catch (error) {
          console.error("Error fetching game results: ", error);
        }
      };

      fetchGameResults();
    }
  }, [user, deckId]);

  return (
    <div className="p-6">
      <div className="grid justify-items-end">
        <Button
          className="font-mono text-white"
          color="warning"
          onClick={() => router.push(`/dashboard`)}
        >
          Back to dashboard
        </Button>
      </div>
      <div className="font-mono ">
        <span className="text-xl font-semibold ">ประวัติการเล่นของ&nbsp;</span>

        <span className="uppercase text-2xl font-semibold border-2 bg-white rounded-md p-2 mb-5">
          {Title}
        </span>

        <span>&nbsp;( 5 ครั้งล่าสุด )</span>
      </div>
      {gameResults.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200">วันที่</th>
              <th className="py-2 px-4 bg-gray-200">คะแนน</th>
              <th className="py-2 px-4 bg-gray-200">เวลาใช้เล่น (วินาที)</th>
            </tr>
          </thead>
          <tbody>
            {gameResults.map((result) => (
              <tr key={result.id} className="text-center">
                <td className="py-2 px-4 border-t">
                  {result.timestamp.toDate().toLocaleString("th-TH")}
                </td>
                <td className="py-2 px-4 border-t">
                  {result.score}/{result.cardCount}
                </td>
                <td className="py-2 px-4 border-t">{result.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="mt-10 text-red-700  flex justify-center">
          ยังไม่มีประวัติการเล่น
        </div>
      )}
    </div>
  );
};

export default PlayHistory;
