import { useState } from "react";
import { auth, db } from "../firebase";
import { addDoc, collection, doc, updateDoc, arrayUnion } from "firebase/firestore";

function CreateWorkspace({ onClose }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    const workspaceName = name.trim();
    if (!workspaceName) return;

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not logged in");

      const workspaceRef = await addDoc(collection(db, "teams"), {
        name: workspaceName,
        ownerId: user.uid,
        members: [user.uid],
        type: "workspace",
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        teams: arrayUnion({
          teamId: workspaceRef.id,
          name: workspaceName,
          type: "workspace",
        }),
      });

      setName("");
      onClose();
    } catch (err) {
      console.error("Error creating workspace:", err);
      alert("Failed to create workspace. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Create Workspace</h3>

        <input
          type="text"
          placeholder="Workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:border-indigo-500 outline-none"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-black cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkspace;
