

function TaskCard({ task, onDelete }) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-3 cursor-pointer">

      <div className="flex justify-between">
        <p className="text-sm font-medium text-gray-800 leading-snug">
          {task.title}
        </p>
        <button onClick={onDelete} className="bg-red-600 text-red-500 hover:text-red-700 transition-transform transform hover:scale-120 rounded-sm text-sm cursor-pointer">🗑️</button>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          
          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center">
            {task.assignee?.charAt(0).toUpperCase() || "U"}
          </div>

          <span className="text-xs text-gray-600">
            {task.assignee || "Unassigned"}
          </span>
        </div>
      </div>

    </div>
  );
}

export default TaskCard;
