import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

export function useTasks(teamId, boardId, columnId) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!teamId || !boardId || !columnId) return;

    const q = query(
      collection(db, "teams", teamId, "boards", boardId, "columns", columnId, "tasks"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const t = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(t);
    });

    return () => unsubscribe();
  }, [teamId, boardId, columnId]);

  return tasks;
}
