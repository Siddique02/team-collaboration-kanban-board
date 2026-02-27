import { useState } from "react";

function AddColumn({ onAdd, onClose }) {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title.trim());
    setTitle("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">
          Add Column
        </h3>

        <input
          type="text"
          placeholder="Column name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:border-indigo-500 outline-none"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddColumn;