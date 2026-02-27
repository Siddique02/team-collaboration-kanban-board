import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

export function useColumns(teamId, boardId) {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (!teamId || !boardId) return;

    const q = query(
      collection(db, "teams", teamId, "boards", boardId, "columns"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cols = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setColumns(cols);
    });

    return () => unsubscribe();
  }, [teamId, boardId]);

  return columns;
}
