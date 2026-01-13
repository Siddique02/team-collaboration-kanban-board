import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

function Sidebar({ userId, onCreateClick, onSelectTeam }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);

    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setTeams(snapshot.data().teams || []);
      } else {
        setTeams([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="w-64 bg-white p-4 flex flex-col shadow-lg shadow-gray-200 h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Home</h2>
        <button
          onClick={onCreateClick}
          className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 cursor-pointer"
        >
          + Create
        </button>
      </div>

      {/* Teams / Workspaces List */}
      <div className="flex flex-col gap-1 overflow-y-auto">
        <h5 className="text-gray-400 font-medium">Workspaces</h5>
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : teams.length === 0 ? (
          <p className="text-sm text-gray-500">No workspaces yet</p>
        ) : (
          teams.map((team) => (
            <div
              key={team.teamId}
              className="px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-100 flex justify-between items-center"
              onClick={() => onSelectTeam(team)}
            >
              <span>{team.name}</span>
              <span className="text-xs text-gray-400">{team.type}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sidebar;