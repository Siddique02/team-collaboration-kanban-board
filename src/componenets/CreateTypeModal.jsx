function CreateTypeModal({ onSelect, onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" />

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-lg">
          
          <h3 className="text-lg font-semibold mb-4">
            Create
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => onSelect("workspace")}
              className="w-full p-3 border rounded-lg hover:bg-gray-100 text-left cursor-pointer"
            >
              🗂 Workspace
            </button>

            <button
              onClick={() => onSelect("team")}
              className="w-full p-3 border rounded-lg hover:bg-gray-100 text-left cursor-pointer"
            >
              👥 Team
            </button>
          </div>

          <button
            onClick={onClose}
            className="mt-4 text-sm text-gray-500 hover:text-black cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default CreateTypeModal;
