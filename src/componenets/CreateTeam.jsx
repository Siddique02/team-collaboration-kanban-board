import { useState } from "react";
import { auth, db } from "../firebase";
import { addDoc, collection, doc, updateDoc, arrayUnion } from "firebase/firestore";

function CreateTeam({ onClose }) {
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const name = teamName.trim();
    if (!name) return;

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const teamRef = await addDoc(collection(db, "teams"), {
        name,
        ownerId: user.uid,
        members: [user.uid],
        type: "team",
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        teams: arrayUnion({
          teamId: teamRef.id,
          name,
          type: "team",
        }),
      });

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
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 cursor-pointer"
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
