import { useState } from "react";
import Sidebar from "../componenets/Sidebar";
import CreateTypeModal from "../componenets/CreateTypeModal";
import CreateWorkspace from "../componenets/CreateWorkspace";
import CreateTeam from "../componenets/CreateTeam";
import InviteMember from "../componenets/InviteMembers";
import KanbanBoard from "../componenets/KanbanBoard";
import { useParams } from "react-router-dom";


function Dashboard() {
  const { userId } = useParams();
  const [modal, setModal] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [inviteModal, setInviteModal] = useState(null);

  const handleTeamDeleted = (deletedTeamId) => {
    if (selectedTeam?.teamId === deletedTeamId) {
      setSelectedTeam(null);
    }
  };

  return (
    <div className="flex h-screen bg-white relative">
      <Sidebar
        userId={userId}
        onCreateClick={() => setModal("type")}
        onSelectTeam={(team) => setSelectedTeam(team)}
        onTeamDeleted={handleTeamDeleted}
      />

      <div className="flex-1 p-6 overflow-x-hidden">
        {selectedTeam ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">{selectedTeam.name}</h1>
              <button
                onClick={() => setInviteModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 cursor-pointer"
              >
                Invite Member
              </button>
            </div>

            {selectedTeam ? (
              <KanbanBoard key={selectedTeam.teamId} team={selectedTeam} teamId={selectedTeam.teamId} boardId={selectedTeam.boardId} />
            ) : (
              <p className="text-gray-400">
                Select a team or workspace from the sidebar
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-400">Select a team or workspace from the sidebar</p>
        )}
      </div>

      {modal === "type" && (
        <CreateTypeModal
          onSelect={(type) => setModal(type)}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "workspace" && <CreateWorkspace onClose={() => setModal(null)} userId={userId} />}
      {modal === "team" && <CreateTeam onClose={() => setModal(null)} userId={userId} />}

      {inviteModal && selectedTeam && (
        <InviteMember
          teamId={selectedTeam.teamId}
          teamName={selectedTeam.name}
          onClose={() => setInviteModal(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;