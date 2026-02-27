import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

function CreateTeam({ onClose, userId }) {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const name = teamName.trim();
    if (!name) return;

    setLoading(true);

    try {
      if (!userId) throw new Error("User not logged in");

      const teamRef = await addDoc(collection(db, "teams"), {
        name,
        ownerId: userId,
        members: [userId],
        type: "team",
      });

      const boardsRef = collection(db, "teams", teamRef.id, "boards");
      const boardRef = await addDoc(boardsRef, {
        name: "Main Board",
      });

      const columnsRef = collection(db, "teams", teamRef.id, "boards", boardRef.id, "columns");
      const defaultColumns = ["To Do", "In Progress", "Done"];
      for (const title of defaultColumns) {
        await addDoc(columnsRef, { title });
      }

      onClose();
    } catch (err) {
      console.error("Error creating team:", err);
      alert("Failed to create team. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Create Team</h3>

        <input
          type="text"
          placeholder="Team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:border-indigo-500 outline-none"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className={`px-4 py-2 ${loading? "bg-indigo-400": "bg-indigo-600"} text-white rounded-lg text-sm ${loading? "hover:bg-indigo-400": "hover:bg-indigo-700"} cursor-pointer`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTeam;
