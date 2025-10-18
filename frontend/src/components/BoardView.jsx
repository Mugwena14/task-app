import React from "react";
import { Plus, X, Trash2, Edit3, Circle, CheckCircle2 } from "lucide-react";

function BoardView({ goals, handleToggleComplete, handleEditClick, handleDeleteClick }) {
  return (
    <div>
      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.length > 0 ? (
          goals.map((goal) => (
            <div
              key={goal._id}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => handleToggleComplete(goal)}
                >
                  {goal.completed ? (
                    <CheckCircle2
                      size={20}
                      className="text-green-500 flex-shrink-0 mt-1"
                    />
                  ) : (
                    <Circle
                      size={20}
                      className="text-gray-400 hover:text-blue-500 flex-shrink-0 mt-1 transition"
                    />
                  )}
                  <div>
                    <p
                      className={`font-medium text-gray-800 ${
                        goal.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {goal.text}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(goal.createdAt).toLocaleString("en-US")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => handleEditClick(goal)}
                  className="p-1.5 rounded-md hover:bg-green-100 text-green-600 transition"
                  title="Edit"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteClick(goal._id)}
                  className="p-1.5 rounded-md hover:bg-red-100 text-red-600 transition"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">No tasks found.</p>
        )}
      </div>
    </div>
  );
}

export default BoardView;
