import { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";

function InviteMemberModal({ teamId, teamName, onClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false)

  const handleInvite = async () => {
    setMessage("");
    if (!email.trim()) return;

    setLoading(true)

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setMessage("❌ User not found.");
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;

      await updateDoc(doc(db, "teams", teamId), {
        members: arrayUnion(userId),
      });

      await updateDoc(doc(db, "users", userId), {
        teams: arrayUnion({ teamId, name: teamName, type: "team" }),
      });

      setEmail("");
      setLoading(false)
      onClose()
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Invite Member</h3>

        <input
          type="email"
          placeholder="User email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:border-indigo-500 outline-none"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-black cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleInvite}
            className={`px-4 py-2 ${loading? "bg-indigo-400": "bg-indigo-600"} text-white rounded-lg text-sm ${loading? "hover:bg-indigo-400": "hover:bg-indigo-700"} cursor-pointer`}
          >
            {loading ? "Inviting..." : "Invite"}
          </button>
        </div>

        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
}

export default InviteMemberModal;
