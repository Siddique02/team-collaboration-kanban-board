import { useEffect, useState } from "react";
import { db } from "../firebase";
import { onSnapshot, collection, query, where, doc, deleteDoc, getDocs } from "firebase/firestore";

function Sidebar({ userId, onCreateClick, onSelectTeam }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTeamMenu, setOpenTeamMenu] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!userId) return;

    const teamsRef = collection(db, "teams");
    const q = query(teamsRef, where("members", "array-contains", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamData = snapshot.docs.map(doc => ({
        teamId: doc.id,
        ...doc.data()
      }));
      setTeams(teamData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleDeleteTeam = async (teamId) => {
    const confirmDelete = window.confirm(
      "This will delete the team, boards, columns, and tasks. Continue?"
    );

    if (!confirmDelete) return;

    try {
      const boardsRef = collection(db, "teams", teamId, "boards");
      const boardsSnap = await getDocs(boardsRef);

      for (const boardDoc of boardsSnap.docs) {
        const columnsRef = collection(db, "teams", teamId, "boards", boardDoc.id, "columns");
        const columnsSnap = await getDocs(columnsRef);

        for (const columnDoc of columnsSnap.docs) {
          const tasksRef = collection(db, "teams", teamId, "boards", boardDoc.id, "columns", columnDoc.id, "tasks");
          const tasksSnap = await getDocs(tasksRef);

          for (const taskDoc of tasksSnap.docs) {
            await deleteDoc(taskDoc.ref);
          }

          await deleteDoc(columnDoc.ref);
        }

        await deleteDoc(boardDoc.ref);
      }

      await deleteDoc(doc(db, "teams", teamId));

      setOpenTeamMenu(null);
    } catch (err) {
      console.error("❌ Error deleting team:", err);
    }

    setSuccessMsg("Team deleted successfully");
    setTimeout(() => {
      setSuccessMsg("");
    }, 3000);
  };


  return (
    <div className="w-64 bg-gray-100 p-4 flex flex-col shadow-lg shadow-gray-200 h-screen">
      {successMsg && (
        <div className="mb-3 rounded-md bg-green-100 text-green-700 px-3 py-2 text-sm">
          ✅ {successMsg}
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Home</h2>
        <button
          onClick={onCreateClick}
          className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 cursor-pointer"
        >
          + Create
        </button>
      </div>

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
              className="group px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-300 flex justify-between items-center relative"
              onClick={() => onSelectTeam(team)}
            >
              <span>{team.name}</span>
              <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                <span className="text-xs text-gray-400 group-hover:opacity-0 transition-opacity">
                  {team.type}
                </span>

                <button
                  onClick={() => setOpenTeamMenu(openTeamMenu === team.teamId ? null : team.teamId)}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 text-gray-600 hover:text-black cursor-pointer"
                >
                  . . .
                </button>
              </div>

              {/* Dropdown menu */}
              {openTeamMenu === team.teamId && (
                <div
                  className="absolute right-1 top-0.5 shadow-md text-xs z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleDeleteTeam(team.teamId)}
                    className="px-3 py-2 bg-white text-red-600 hover:bg-gray-100 w-full text-left cursor-pointer rounded-md"
                  >
                    🗑 Delete team
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sidebar;