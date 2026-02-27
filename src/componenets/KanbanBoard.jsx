import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import AddColumn from "./AddColumn";
import { useEffect } from "react";
import { collection, addDoc, query, onSnapshot, doc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";


const DEFAULT_COLUMNS = [
  { id: "todo", title: "To Do", tasks: [] },
  { id: "in-progress", title: "In Progress", tasks: [] },
  { id: "done", title: "Done", tasks: [] },
];

function KanbanBoard({ teamId }) {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [boardId, setBoardId] = useState(null)

  useEffect(() => {
  if (!teamId) return;

  const boardsRef = collection(db, "teams", teamId, "boards");

  const unsubscribe = onSnapshot(boardsRef, (snapshot) => {
    if (!snapshot.empty) {
      setBoardId(snapshot.docs[0].id);
    }
  });

  return () => unsubscribe();
}, [teamId]);

  useEffect(() => {
    if (!teamId || !boardId) return;

    const columnsRef = collection(db, "teams", teamId, "boards", boardId, "columns");
    const q = query(columnsRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cols = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setColumns(cols);
    });

    return () => unsubscribe();
  }, [teamId, boardId]);

  const handleAddColumn = async (title) => {
    if (!title) return;
    try {
      const columnsRef = collection(db, "teams", teamId, "boards", boardId, "columns");
      await addDoc(columnsRef, {
        title,
      });
    } catch (err) {
      console.error("Error adding column:", err);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    if (!teamId || !boardId || !columnId) return;

    try {
      const tasksRef = collection(db, "teams", teamId, "boards", boardId, "columns", columnId, "tasks");
      const tasksSnapshot = await getDocs(tasksRef);

      for (const taskDoc of tasksSnapshot.docs) {
        await deleteDoc(taskDoc.ref);
      }

      const columnRef = doc(db, "teams", teamId, "boards", boardId, "columns", columnId);
      await deleteDoc(columnRef);

    } catch (err) {
      console.error("Error deleting column:", err);
    }
  };

  if (!boardId) return <p>Loading board...</p>;

  return (
    <div className="flex flex-col h-full">

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowAddColumn(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 cursor-pointer"
        >
          + Add Column
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {boardId && columns.map((column) => (
          <KanbanColumn
            key={column.id}
            boardId={boardId}
            column={column}
            teamId={teamId}
            onDeleteColumn={handleDeleteColumn}
          />
        ))}
      </div>

      {showAddColumn && (
        <AddColumn
          onAdd={handleAddColumn}
          onClose={() => setShowAddColumn(false)}
        />
      )}
    </div>
  );
}

export default KanbanBoard;