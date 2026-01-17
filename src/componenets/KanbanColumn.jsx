import { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import AddTask from "./AddTask";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query, addDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";

function KanbanColumn({ column, teamId, boardId, onDeleteColumn }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!teamId || !boardId || !column?.id) {
      console.error("Missing Firestore path values", { teamId, boardId, column });
      return;
    }

    const tasksRef = collection(db, "teams", teamId, "boards", boardId, "columns", column.id, "tasks");
    const q = query(tasksRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(loadedTasks);
    });

    return () => unsubscribe();
  }, [teamId, boardId, column.id]);

  const handleAddTask = async (task) => {
    try {
      const tasksRef = collection(db, "teams", teamId, "boards", boardId, "columns", column.id, "tasks");
      await addDoc(tasksRef, {
        title: task.title,
        assignee: task.assignee || "",
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const taskRef = doc(db, "teams", teamId, "boards", boardId, "columns", column.id, "tasks", taskId);
      await deleteDoc(taskRef);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="bg-gray-100 rounded-xl shadow p-4 flex flex-col max-h-[calc(100vh-180px)] min-w-72 overflow-hidden">
      
      <div className="flex justify-between items-center">
        <h3 className="font-semibold mb-3">{column.title} - {tasks.length}</h3>
        <button
          onClick={() => onDeleteColumn(column.id)}
          className="bg-red-600 text-red-500 hover:text-red-700 transition-transform transform hover:scale-120 rounded-sm text-sm cursor-pointer"
        >
          🗑️
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {tasks.map((task) => (
          <div key={task.id}>
            <TaskCard task={task} onDelete={()=>handleDeleteTask(task.id)}/>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        className="mt-3 w-full bg-indigo-600 text-white py-1 rounded text-sm hover:bg-indigo-700 cursor-pointer"
      >
        + Add Task
      </button>

      {showAddModal && (
        <AddTask
          onAdd={handleAddTask}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

export default KanbanColumn;