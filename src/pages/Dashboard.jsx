import { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../componenets/Sidebar";
import CreateTypeModal from "../componenets/CreateTypeModal";
import CreateWorkspace from "../componenets/CreateWorkspace";
import CreateTeam from "../componenets/CreateTeam";
import InviteMember from "../componenets/InviteMembers";
import KanbanBoard from "../componenets/KanbanBoard";

function Dashboard() {
  const { userId } = useParams();

  const [modal, setModal] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [inviteModal, setInviteModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTeamDeleted = (deletedTeamId) => {
    if (selectedTeam?.teamId === deletedTeamId) {
      setSelectedTeam(null);
    }
  };

  return (
    <div className="flex h-screen bg-white relative overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
          fixed md:static z-50 top-0 left-0 h-full
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          transition-transform duration-300 ease-in-out
        `}
      >
        <Sidebar
          userId={userId}
          onCreateClick={() => setModal("type")}
          onSelectTeam={(team) => {
            setSelectedTeam(team);
            setSidebarOpen(false);
          }}
          onTeamDeleted={handleTeamDeleted}
        />
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-x-hidden w-full">
        <div className="md:hidden flex items-center justify-between mb-4">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl">
            ☰
          </button>

          {selectedTeam ? (
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold truncate">
                {selectedTeam.name}
              </h1>
              <button
                onClick={() => setInviteModal(true)}
                className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
              >
                Invite
              </button>
            </div>
          ) : null}
        </div>

        {selectedTeam ? (
          <div>
            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">{selectedTeam.name}</h1>
              <button
                onClick={() => setInviteModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 cursor-pointer"
              >
                Invite Member
              </button>
            </div>

            <KanbanBoard
              key={selectedTeam.teamId}
              team={selectedTeam}
              teamId={selectedTeam.teamId}
              boardId={selectedTeam.boardId}
            />
          </div>
        ) : (
          <p className="text-gray-400">
            Select a team or workspace from the sidebar
          </p>
        )}
      </div>

      {/* Modals */}
      {modal === "type" && (
        <CreateTypeModal
          onSelect={(type) => setModal(type)}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "workspace" && (
        <CreateWorkspace onClose={() => setModal(null)} userId={userId} />
      )}
      {modal === "team" && (
        <CreateTeam onClose={() => setModal(null)} userId={userId} />
      )}

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
